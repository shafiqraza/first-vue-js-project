var eventBus = new Vue();


Vue.component('product-review',{
    template : `
    <div>
        <h4 class="text-center mt-1 mb-5">Give us your reviews</h4> 
        <div class="text-center" v-if="errors.length">
            <p><b> Please correct the following error(s)</b></p>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>    
        </div>
        <form class="pb-5 pt-2" @submit.prevent="onSubmit">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" v-model="name" />
            </div>
            <div class="form-group">
                <label for="review">Review:</label>
                <textarea class="form-control"  v-model="review"></textarea>
            </div>
            <div class="form-group">
                <label for="rating">Rating:</label>
                <select class="custom-select mr-sm-2" id="inlineFormCustomSelect" v-model.number="rating">
                    <option value="5">Five</option>
                    <option value="4">Four</option>
                    <option value="3">Three</option>
                    <option value="2">Two</option>
                    <option value="1">One</option>
                </select>
            </div>
            <div class="form-group">
                <label>Would you recommend this product?</label>
                <div class="radio">
                    <label><input type="radio" name="optradio" value="yes" v-model="isrecommended"> Yes</label>
                </div>
                <div class="radio">
                    <label><input type="radio" name="optradio" value="no" v-model="isrecommended"> No</label>
                </div>
                </div>
            <div class="form-group">
                    <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
    `,
    data(){
        return{
            name: null,
            rating: null,
            review: null,
            isrecommended: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.isrecommended){
                let productReview = {
                    name: this.name,
                    rating: this.rating,
                    review: this.review,
                    isrecommended: this.isrecommended
                }
                eventBus.$emit('review-submitted',productReview);
                this.name = null;
                this.rating = null;
                this.review = null;
                this.isrecommended = null;
            }else{
                if(!this.name) this.errors.push('Name field can not be empty');
                if(!this.rating) this.errors.push('Rating field can not be empty');
                if(!this.review) this.errors.push('Review field can not be empty');
                if(!this.isrecommended) this.errors.push('Please answer the question');
            }
        }
    }
});

Vue.component('product-tabs',{
    props:{
        reviews: {
            type: Array,
            required: true
        }
    },
    template:  `
        <div>
            <div class="tabs">
                <span v-for="(tab,index) in tabs" :key="index" @click="selectedTab = tab" :class="{activeTab: selectedTab === tab}"> {{ tab }} </span> 
            </div>
 
            <div class="row mb-5 justify-content-center border">
                <div class="col-md-8 mt-5 mb-5" v-show="selectedTab === 'Reviews'">
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">No reviews yet.</p>
                    <div class="bg-light">
                        <div v-for="review in reviews">
                            Name: {{ review.name }}
                            <br />
                            Reviews: {{ review.review }}
                            <br />
                            Rating: {{ review.rating }}
                            <br />
                            Recommended: {{ review.isrecommended }}
                        </div>
                    </div>
                </div>
                <div class=" col-md-8 mt-5 mb-5" v-show="selectedTab === 'Make a review'">
                    <product-review></product-review>
                </div>
            </div>
        </div>        
    `,
    data(){
        return {
            tabs:['Reviews','Make a review'],
            selectedTab: 'Make a review'
        }
    }
});

Vue.component('shipping-details-tabs',{
    props:{
        shipping:{
            type: String,
            required: true
        },
        details:{
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <span v-for="tab in tabs" @click="selectedTab = tab" :class="{activeTab: selectedTab === tab}"> {{ tab }} </span>
        <p v-show="selectedTab === 'Shipping'">Shipping: {{ shipping }}</p>
        <ul v-show="selectedTab === 'Details'">
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    </div>`,
    data(){
        return {
            tabs: ['Shipping','Details'],
            selectedTab: 'Shipping'
        }
    },
    methods:{
        con(){
            console.log('clickkkkk');
        }
    }
});

Vue.component('product',{
    props: {
        premium: {
            type : Boolean,
            required: true,
        },
        cart: {
            required: true,
            default: 0
        }
    },
    template: `
     <div class="container mt-5">
        <div class="row">
            <div class="col-md-4">
                <img v-bind:src="image" alt="Product Image" class="img-fluid">
            </div>
            <div class="col-md-8">
                <span class="h1">{{ title }}</span>
                <p>{{ onSale }}</p>
                <!-- <p>{{ description }}</p> -->
                <p v-if="inStock > 10">In Stock</p>
                <p v-else-if="inStock <= 10 && inStock > 0">Almost Soldout</p>
                <p v-else="" :class="{outOfStock: !inStock}">Out of Stock</p>
                <shipping-details-tabs :shipping="shipping" :details="details"></shipping-details-tabs>
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
                    <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box  mb-3" v-bind:style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
                    </div>
                <span>
                    <button class="btn btn-primary" v-on:click="addToCart"  :disabled="!inStock">Add to cart</button>
                    <button class="btn btn-danger" v-on:click="removeToCart" :disabled="!inStock || cart < 1">Remove to cart</button>
                </span>
            </div>
        </div>
        <div >    

            <product-tabs :reviews="reviews"></product-tabs>
            
        </div>
    </div>`,

    data(){
        return {
            brandName: 'Vue Mastery',
            product: 'Socks',
            description: 'This is socks',
            selectedVariant:0,
            link: 'https://github.com/',
            inventory: 10,
            isSale: false,
            details: ['80% cotton', '20% polyestor', 'Gender-neutral'],
            sizes: ['XL','L','M','S'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'Green',
                    variantImage: './images/socksGreen.png',
                    variantQuantity: 8,
                },
                {
                    variantId: 2235,
                    variantColor: 'Blue',
                    variantImage: './images/socksBlue.png',
                    variantQuantity: 10,
                }
            ],
            reviews: []
        }        
    },
    methods: {
        updateProduct: function(index){
            this.selectedVariant  = index;
        },
        addToCart: function(){
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId);
        },
        removeToCart: function(){
            this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId);
        }
    },
    computed: {
        title(){
            return this.brandName + ' ' + this.product;
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        onSale(){
            if(this.isSale){
                return this.brandName + ' ' + this.product + ' are on sale !'
            }else{
                return this.brandName + ' ' + this.product + ' are not on sale!'
            }
        },
        shipping(){
            if(this.premium){
                return 'Free';
            }
            return 2.99
        }
    },
    mounted(){
        eventBus.$on('review-submitted',  (productReview) =>  {
            this.reviews.push(productReview);
        });
    }

});

var app = new Vue({
    el: '#app',

    data: {
        cart: [],
        premium: true
    },
    methods: {
        updateCart(variantId){
            this.cart.push(variantId);
        },
        removeFromCart(variantId){
            this.cart.pop(variantId);
        }
    }
});