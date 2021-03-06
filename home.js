function openNav() {
  var client_width = document.documentElement.clientWidth;
  if (client_width <= 1200) {
    document.getElementById("mySidebar").style.width = "30%";
    document.getElementById("main").style.marginLeft = "30%";
    document.getElementById("file-upload-container").style.marginLeft = "20%";
  } else {
    document.getElementById("mySidebar").style.width = "10%";
    document.getElementById("main").style.marginLeft = "10%";
  }
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("file-upload-container").style.marginLeft = "0%";
}
