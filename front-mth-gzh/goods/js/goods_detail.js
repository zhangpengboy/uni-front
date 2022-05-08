/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-26 21:12:54
 * @Description : TODO
 */

$(document).ready(function () {
  var alertHtml = $(".alertHtml")
  var boxmark = $(".box-mark")

  function showhtml(params) {
    alertHtml.show()
    boxmark.show()
    alertHtml.html(params)
    setTimeout(function () {
      alertHtml.hide()
      boxmark.hide()
    }, 1000);
  }
  var goodsId = window.Utils.GetQueryString("goodsId") //"1394979569978978304"
  if (!goodsId) {
    return setTimeout(showhtml('商品ID不存在'), 500);
  }
  $.ajax({
    type: "post",
    url: goodsDetailsCooperation.getInfo,
    data: JSON.stringify({
      goodsId: goodsId
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    dataType: "json",
    success: function (res) {
      if (res.code == '200' && res.data) {
        const imgArr = res.data.detailImg.split(",");
        let htmlStr = "";
        imgArr.map(v => {
          htmlStr += `<img src="${v}" />`
        })
        $('.detailImg').html(htmlStr);
      }

    }
  })

});
