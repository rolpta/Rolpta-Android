//assist
var assist = '';
assist += '<div class="fixed-action-btn" id="helpbtn">';
assist += '  <a class="btn-floating btn-normal green">';
assist += '    <i class="material-icons">info</i>';
assist += '  </a>';
assist += '  <ul>';
assist += '    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>';
assist += '    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>';
assist += '    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>';
assist += '    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>';
assist += '  </ul>';
assist += '</div>';

//footer menu
var footermnu = '<div class="footermenu">';
footermnu += '<div class="row">';
footermnu += '<div class="col smn">';
footermnu += '<a href="home.html" id="homelnk" class="waves-effect waves-light">';
footermnu += '<i class="material-icons dp48"><img src="assets/img/menu/home.png"></i>';
footermnu += '<span>Home</span>';
footermnu += '</a>';
footermnu += '</div>';
footermnu += '<div class="col smn">';
footermnu += '  <a href="quickmedia.html" id="quicklnk" class="waves-effect waves-light">';
footermnu += '  <i class="material-icons dp48"><img src="assets/img/menu/book.png"></i>';
footermnu += '<span>QuickMedia</span>';
footermnu += '</a>';
footermnu += '</div>';
footermnu += '<div class="col smn">';
footermnu += '<a href="shop.html" id="shoplnk" class="waves-effect waves-light">';
footermnu += '<i class="material-icons dp48"><img src="assets/img/menu/cart.png"></i>';
footermnu += '<span>Shop</span>';
footermnu += '</a>';
footermnu += '</div>';
footermnu += '<div class="col smn">';
footermnu += '  <a href="account.html" id="accountlnk" class="waves-effect waves-light">';
footermnu += '  <i class="material-icons dp48"><img src="assets/img/menu/profile.png"></i>';
footermnu += '  <span>My Account</span>';
footermnu += '  </a>';
footermnu += '  </div>';
footermnu += ' </div>';
footermnu += '</div>';

//menubar
var menubar='<nav class="fixed-top">';
    menubar+='<div class="nav-wrapper">';
    menubar+='  <div class="col sn left">';
    menubar+='    <div class="center">';
    menubar+='    <a href="#"  data-target="slide-out" id="sidenav-trigger" class="notif sidenav-trigger">';
    menubar+='      <img src="assets/img/menu.png">';
    menubar+='    </a>';
    menubar+='    </div>';
    menubar+='  </div>';


    menubar+='  <div class="col sn right">';

    menubar+='    <div class="center">';
    menubar+='    <a href="cart.html"  id="cartlnk" class="notif">';
    menubar+='      <img src="assets/img/shop.png">';
    menubar+='    </a>';
    menubar+='  </div>';

    menubar+='</div>';
    menubar+='</div>';
    menubar+='</nav>';

//sidenav
var sidenav='<ul id="slide-out" class="sidenav">';
   sidenav+='<li><div class="user-view">';
   sidenav+=' <img class="" src="assets/img/yuna.png">';
   sidenav+='</div></li>';
   sidenav+='<li><div class="divider"></div></li>';

   sidenav+='<li><a class="waves-effect" href="about.html">About</a></li>';
   sidenav+='<li><a class="waves-effect" href="contact.html">Contact</a></li>';
   sidenav+='<li><a class="waves-effect" href="disclaimer.html">Disclaimer</a></li>';
   //sidenav+='<li><a class="waves-effect" href="lang.html">EN FR</a></li>';
   sidenav+='<li><div class="divider"></div></li>';
   sidenav+='</ul>';
