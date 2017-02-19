let dataList = [{
    height: 490,
    width: 300,
    img: "img/phone1.jpg"
},
{
    height: 400,
    width: 300,
    img: "img/phone2.jpg"
},
{
    height: 400,
    width: 300,
    img: "img/phone3.jpg"
},
{
    height: 340,
    width: 300,
    img: "img/phone4.jpg"
}];

new Slider({
    dom : document.getElementById('canvas'),
    dataList : dataList
});