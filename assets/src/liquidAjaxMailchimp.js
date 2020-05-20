(function($) {
	
	$('.ld_sf_form').on('submit', function(event) {

		event.preventDefault();

		var $form = $(this);
		var $response = $('.ld_sf_response', $form.parent());

		$form.addClass('form-submitting');
		
		$.ajax({
			type: $form.attr('method'),
			url: $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
			data: $form.serialize(),
			cache: false,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			error: function (err) {
			
				$form.removeClass('form-submitting');
				alert('Could not connect to the registration server. Please try again later.')

			},
			success: function (data) {

				$form.removeClass('form-submitting');
				
				if (data.result === 'success') {
					$response.addClass('ld_sf_response-success');
					$response.html('<p>Thank you for subscribing. We have sent you a confirmation email.</p>');
				} else {
					$response.addClass('ld_sf_response-error');
					$response.html('<p>' + data.msg.substring(4) + '</p>')
				}
				
			}
		});

	});
		
})(jQuery);