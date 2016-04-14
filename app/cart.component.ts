import {Component, EventEmitter} from 'angular2/core';
import {Card} from './card.model';


@Component({
  selector: 'cart',
  inputs: ['cart'],
  outputs: ['onCheckout'],
  template: `
  <div class="container">
    <div *ngFor="#item of cart" class="shoppingCart">
      <img src="{{item.image}}">
      <p><strong>Supported Charity:</strong> {{item.charities}}</p>
      <p><strong>Photographer:</strong> {{item.photographer}}</p>
      <p><strong>Price:</strong> \${{item.price}}.00</p>
    </div>
    <p><strong>Total: \${{getTotal()}}.00</strong></p>
    <div class="checkoutBtns">
      <button (click)="checkout()" class="homeSlide">Checkout</button>
      <button class="homeSlide">Close Cart</button>
    </div>
</div>
  `
})

export class CartComponent {
  public cart: Array<any>;
  public onCheckout: EventEmitter<any>;
  public myDataRef = new Firebase('https://picacause.firebaseio.com/');
  constructor() {
    this.onCheckout = new EventEmitter();
  }
  getTotal() {
    var total = 0;
    for(var i = 0; i < this.cart.length; i++) {
      total += this.cart[i].price;
    }
    return total;
  }
  checkout() {
    var cartClass = this;
    for(var i = 0; i < this.cart.length; i++) {
      this.myDataRef.child('charities').orderByChild('name').equalTo(this.cart[i].charities).on('child_added', function(snapshot) {
        var secured = snapshot.val().secured;
        var newSecured = secured + 5;
        var charityRef = cartClass.myDataRef.child('charities').child(snapshot.key());
        charityRef.update({
          "secured": newSecured
        });
      });
    }
    this.cart = [];
    this.onCheckout.emit(0);
  }
}
