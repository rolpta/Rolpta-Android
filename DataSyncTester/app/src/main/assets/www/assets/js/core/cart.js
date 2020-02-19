

var newcart={
'items':[],
'vars':0, //total number of variants
'qtty':0, //total quantity of variants
'subtotal':0,
'total':0,
};

if(scart=store.get('ecart')) {
  //retrieve from store
  ecart=scart;
} else {
  //reset to new
  ecart=newcart;
}



//add product to cart
function addtocart(product,selvar,selqtty) {
  cid=product.id+'_'+selvar.id; //cart id
  item={'cid':cid,'pdtid':product.id,'varid':selvar.id,'title':product.title,'img':product.img,'type':selvar.title,'price':parseInt(selvar.price),'qtty':parseInt(selqtty)};


  var found=false;

  //search for items
  $.each(ecart.items, function(i, _item){
    if(_item.cid==item.cid) {found=i;}
  });

  if(found) {
    //update item
    ecart.items[found].qtty+=item.qtty;
  } else {
    //add item
    ecart.items.push(item);
  }




  walert("Item added to cart.");

  cartupdate();
}


//update the cart UI of the cart
function cartupdate() {
  //do calculations
  ecart.vars=countProperties(ecart.items);

  //zero before loop
  ecart.total=ecart.subtotal=ecart.qtty=0;
  $.each(ecart.items, function(i, item){
    ecart.qtty+=item.qtty;
    ecart.subtotal+= (item.price * item.qtty);
  });

  ecart.total+=ecart.subtotal;




  //store cart
  store.set('ecart',ecart);

if(ecart.qtty>0) {
  $('span#ccount').html(ecart.qtty).show();
} else {
  $('span#ccount').hide();
}


}

//updatecart
function cart_item_update(cid,dir) {

    var found=-1;

    //search for items
    $.each(ecart.items, function(i, _item){
      if(_item.cid==cid) {found=i;}
    });


    if(found!=-1) {
      //update quantity
      if(dir=='+') {
        ecart.items[found].qtty+=1;
      } else {
        ecart.items[found].qtty-=1;
      }

      //deletion
      if(ecart.items[found].qtty<1) {
          ecart.items.splice(found, 1);
      }


      cartupdate();
      //console.log(ecart);

    }


    return false;
}

//clear cart
function clearcart() {
  ecart=newcart; //reset
  cartupdate();

}


//render display of cart on cart.html
function cart_listview() {
    if(ecart.qtty==0) {
      //show empty cart
      $('#emptycart').removeClass('hide');

      $('#filledcart').addClass('hide');

    } else {
      //render display

      //quantity
      qty=ecart.qtty==1 ? "1 item" : ecart.qtty+' items';
      $('.cart_count').html(qty);

      $('#crt_total').html('₦ '+number_format(ecart['total']));

      //render cart items

      $('#renderer tbody').html('');

      $.each(ecart.items, function(i, item){
        //console.log(item);

        d='<tr><td>';
        d+='<img class="img-round" src="'+item['img']+'">';
        d+='</td><td>';
        d+='<h6 class="hdr">';
        d+=item['title'];
        d+='<br/>';
        d+=item['type'];
        d+='<br/>';
        d+='<span class="money">'+    '₦ '+number_format(item['price']*item['qtty'])+'</span>';
        d+='</h6><br/>';
        d+='<div class="kicksey">';
        d+='<a class="btn-large red btn-dir" dir="+" cid="'+item['cid']+'"><i class="material-icons">arrow_drop_up</i></a>';
        d+='<span class="">'+item['qtty']+'</span>';
        d+='<a class="btn-large red btn-dir" dir="-" cid="'+item['cid']+'"><i class="material-icons">arrow_drop_down</i></a>';
        d+='</div>';
        d+='</td></tr>';

        $('#renderer tbody').append(d);

      });


      $('#emptycart').addClass('hide');
      $('#filledcart').removeClass('hide');

      //bind za buttons
      $('a.btn-dir').on('click',function() {
        dir=$(this).attr('dir');
        cid=$(this).attr('cid');

        cart_item_update(cid,dir);
        cart_listview();

        return false;
      });

    }
}


$(function() {
  //retrieve from store

  $('a#cartlnk').append('<span id="ccount"></span>');

  cartupdate();
});
