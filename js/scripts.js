$(document).ready(function(){
	$(document).on('submit', 'form.ajaxable', function () {
		var form = $(this);
		form.find('input[type="submit"]').attr('disabled', true).after($('#qa-waiting-template').clone().removeAttr('id'));
		form.ajaxSubmit({
			type: 'post',
			url: form.attr('action'),
			dataType: 'json',
			error: function () {
				form.find('input[type="submit"]').removeAttr('disabled')
				form.find('span.help-inline').remove();
				form.find('.qa-waiting').remove();
				form.find('.captcha_reload').click();
				alert('Произошла ошибка');
			},
			success: function (result) {
				form.find('input[type="submit"]').removeAttr('disabled')
				form.find('span.help-inline').remove();
				if (result.success) {
					if (typeof result.redirect !== 'undefined') {
						document.location.href = result.redirect;
					} else {
						document.location.href = document.location.href;
						document.location.reload();
					}
				} else {
					if (typeof result.errors !== 'undefined') {
						$.each(result.errors, function (k, v) {
							var error = '';
							$.each(v, function (k1, v1) {
								error += v1 + '<br>';
							})
							var el = form.find('input[name*="[' + k + ']"]');
							if (!el.length) {
								var el = form.find('textarea[name*="[' + k + ']"]');
							}
							if (el.length) {
								el.last().after('<span class="help-inline"><div class="qa-form-tall-error">' + error + '</div></span>')
							}
						});
					}
					form.find('.qa-waiting').remove();
					form.find('a.captcha_reload')[0].click();
				}
			}
		});
		return false;
	});
	$(document).on('submit', 'form.qa-subscribe', function () {
		var form = $(this);
		form.find('button').attr('disabled', true);
		form.ajaxSubmit({
			type: 'post',
			url: form.attr('action'),
			dataType: 'json',
			error: function () {
				form.find('button').removeAttr('disabled')
				alert('Произошла ошибка');
			},
			success: function (result) {
				form.find('button').removeAttr('disabled')
				if (result.success) {
					$('.c-subscribe-box').find('input[name="email"]').val('');
					$('.c-subscribe-box').removeClass('active');
				}
				if (result.message) {
					alert(result.message);
				}
			}
		});
		return false;
	});
	$('.qa-tab-changer a').on('click', function () {
		$(this).parent().find('a').removeClass('active');
		$(this).addClass('active');
		$('.qa-q-list').hide();
		$('#qa-q-list-' + $(this).data('id')).show();
		return false;
	});
	$('.voting a').on('click', function () {
		var link = $(this);
		if (link.attr('href') === '#') {
			return false;
		}
		$.ajax({
			type: 'get',
			url: link.attr('href'),
			dataType: 'json',
			error: function () {
				alert('Произошла ошибка');
			},
			success: function (result) {
				if (typeof result.rating !== 'undefined') {
					link.parent().find('.count').html(result.rating);
					if (result.result === 'cancel') {
						link.parent().find('a').removeClass('disabled').addClass('enabled');
					} else {
						link.parent().find('a').removeClass('enabled').addClass('disabled');
						link.removeClass('disabled').addClass('enabled');
					}
				}
			}
		})
		return false;
	});
	$('.qa-a-select-button').on('click', function () {
		var link = $(this);
		$.ajax({
			type: 'get',
			url: link.attr('href'),
			dataType: 'json',
			error: function () {
				alert('Произошла ошибка');
			},
			success: function (result) {
				document.location.href = document.location.href;
				document.location.reload();
			}
		})
		return false;
	});
	/*$('.qa-a-edit-answer').on('click', function () {
		var link = $(this);
		$.ajax({
			type: 'get',
			url: link.attr('href'),
			dataType: 'html',
			error: function () {
				alert('Произошла ошибка');
			},
			success: function (result) {
				link.parents('.answer').replaceWith(result);
			}
		})
		return false;
	});*/
	var popover_time;
	$('body').on('mouseenter', '.avatar[data-id]', function (event) {
		if ($('.user-popover').is(':visible')) {
			$('.user-popover').hide();
		}

		var userid = $(this).data('id');
		var container = $(this);

		popover_time = setTimeout(function () {
			if ($('body').find('#' + userid + '_popover').length == 0) {
				container.addClass('mouseover');
				$.ajax({
					type: 'get',
					url: '/user/' + userid + '/popup',
					dataType: 'html',
					success: function (response) {
						$('body').append(response);
						$('#' + userid + '_popover').position({my: 'center bottom', at: 'center top', of: container, collision: 'fit flip'});
						$('#' + userid + '_popover').show();
						container.delay(500).queue(function () {
							container.removeClass('mouseover');
							container.dequeue();
						});
					}
				});
			} else {
				$('#' + userid + '_popover').removeAttr('style');
				$('#' + userid + '_popover').position({my: 'center bottom', at: 'center top', of: container, collision: 'fit flip'});
				$('#' + userid + '_popover').show();
			}
		}, 500);
	}).on('mouseleave', '.avatar[data-id]', function (event) {
		clearTimeout(popover_time);
		var userid = $(this).data('id');
		$('#' + userid + '_popover').hide();
		$(this).removeClass('mouseover');
	});
	$('#upload-cover').on('click', function () {
		$.ajax({
			type: 'GET',
			dataType: 'html',
			url: '/uploadbackground',
			success: function (response) {
				$('body').append(response);
				$('#cover-uploader').modal('show');
			}
		});
		return false;
	});
	$('.qa-question-similar').on('blur', function () {
		var q = $(this).val().trim();
		$('#similar').html('').hide();
		if (q.length > 0) {
			$.ajax({
				type: 'GET',
				data: {q: q},
				dataType: 'json',
				url: '/ask/similar',
				success: function (response) {
					if (typeof response.results !== 'undefined' && response.results.length > 0) {
						$('#similar').html('Прежде чем продолжить, проверьте, не был ли такой вопрос уже задан:<br>').show();
						$.each(response.results, function (k,v) {
							$('#similar').append('<a target="_blank" href="' + v.link + '">' + v.question + '</a>')
						});
					}
				}
			});
		}
	});

    // Search submit
    $('.o-toggle-link').click(function(e){
        var $a = $(this),
            $content = $($a.attr('data-rel')),
            text = $a.text(),
            text2 = $a.attr('data-toggle');

            console.log($a.attr('data-rel'));

            $content.slideToggle();
            $a.toggleClass('active').attr('data-toggle', text).text(text2);

            return false;
    });
    //

    //Year list
    $('.c-year-list__item-year span').click(function(e){
        $('.c-year-list__item').removeClass('active');
        $(this).closest('.c-year-list__item').addClass('active');
        return false;
    });
    //

    //Slider
    var $sliderWrapper = $('.js-slider__thumbs-wrapper');
    var $sliderFrame = $('.js-slider__thumbs-frame');
    var sliderItemWidth = 94;
    var sliderFrameWidth = $sliderWrapper.width();
    var sliderLen = $sliderFrame.find('li').length;
    var sliderWidth = sliderLen*sliderItemWidth - 9;
    var sliderCurrent = 0;
    var sliderVisible = 6;

    if (sliderWidth > sliderFrameWidth){
        $('<div class="js-slider__aleft"><span class="icon arr-left"></div>').appendTo($sliderWrapper);
        $('<div class="js-slider__aright"><span class="icon arr-right"></div>').appendTo($sliderWrapper);
    }

    var $sliderLeft = $('.js-slider__aleft');
    var $sliderRight = $('.js-slider__aright');

    $sliderLeft.hide();

    $sliderLeft.click(function(){
        sliderCurrent--;
        if (sliderCurrent == 0){
            $sliderLeft.hide();
        }
        $sliderRight.show();
        $sliderFrame.find('ul').css('transform', 'translateX(' + -1* sliderCurrent*(sliderFrameWidth + 9) + 'px)')
    });
    $sliderRight.click(function(){
        sliderCurrent++;
        if ((sliderCurrent + 1)*sliderFrameWidth > sliderWidth){
            $sliderRight.hide();
        }
        $sliderLeft.show();
        $sliderFrame.find('ul').css('transform', 'translateX(' + -1* sliderCurrent*(sliderFrameWidth + 9) + 'px)')
    });
    $sliderFrame.find('a').click(function(e){
        var img = $(this).attr('data-img');
        var text = $(this).attr('data-text');
        $('<img/>').load(function(){
            $('.o-media-box__img img').attr('src', img);
            $('.o-media-box__body p').text(text);
        }).attr('src', img);
        $sliderFrame.find('li').removeClass('active');
        $(this).parent().addClass('active');
        return false;
    });
    //
});
