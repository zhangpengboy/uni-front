
$(document).ready(function () {

  $('#submitForm').click(function (e) {

    var _name = $(".name").val();
    var _tel = $(".tel").val();
    var _remark = $(".remark").val();
    var reg = /^1[3456789]\d{9}$/;
    var alertHtml = $(".alertHtml")
    var boxmark = $(".box-mark")

    function showhtml(params) {
      alertHtml.show()
      boxmark.show()
      alertHtml.html(params)
      setTimeout(function() {
        alertHtml.hide()
        boxmark.hide()
      }, 1000);
    }

    if (_name == '') {
      setTimeout(showhtml('请输入您的名字'), 500);
      return false
    }
    if (!reg.test(_tel)) {
      setTimeout(showhtml('请填写正确电话号码'), 500);
      $('.tel').val('');
      return false
    }
    var _params = {
      name: _name,
      phone: _tel,
      message: _remark,
      type: $("input[name='radio']:checked").val() == 'Operator' ? 1 : 2,
    }
    $.ajax({
      type: "post",
      url: storeBusinessCooperation.add,
      data: JSON.stringify(_params),
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: "json",
      success: function (res) {
        setTimeout(showhtml('提交成功'), 500);
        $('.name').val('');
        $('.tel').val('');
        $('.remark').val('');
      }
    })
  });


  $(".radio-text").click(function (e) {

    $("input[name='radio'][value=" + $(this).data('value') + "]").click()
  });

  $("#operator").change(function (e) {

    $('.content-box').removeClass("partner-bg").addClass("operator-bg")
    var _value = $(this).val();
    $('.first-item[data-value=' + _value + ']').addClass("first-active").siblings().removeClass('two-active');
  });

  $("#partner").change(function (e) {

    $('.content-box').removeClass("operator-bg").addClass("partner-bg")
    var _value = $(this).val();
    $('.two-item[data-value=' + _value + ']').addClass("two-active").siblings().removeClass('first-active')
  });

  $(".operator").click(function (e) {

    $('.content-box').removeClass("partner-bg").addClass("operator-bg")
    $(".first-item").addClass("first-active").siblings().removeClass('two-active')
  });

  $(".partner").click(function (e) {

    $('.content-box').removeClass("operator-bg").addClass("partner-bg")
    $('.two-item').addClass("two-active").siblings().removeClass('first-active')
  });

  $(".first-item").click(function (e) {

    $(this).addClass("first-active").siblings().removeClass('two-active')
    $('.content-box').removeClass("partner-bg").addClass("operator-bg")
    $("input[name='radio'][value=" + $(this).data('value') + "]").click()
  })

  $(".two-item").click(function (e) {

    $(this).addClass("two-active").siblings().removeClass('first-active')
    $('.content-box').removeClass("operator-bg").addClass("partner-bg")
    $("input[name='radio'][value=" + $(this).data('value') + "]").click()
  });



});
