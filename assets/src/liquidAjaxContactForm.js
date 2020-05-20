(function($) {

	'use strict';

	$('form', '.contact-form ').submit(function(event){

		event.preventDefault(); //prevent default action 

		var proceed = true;
		var form = this;
		var results = $(form).siblings('.contact-form-result');
		var output;
		
		//simple validation at client's end
		//loop through each field and we simply change border color to red for invalid fields		
		$(form).find(':required').each(function(){
			$(this).css('border-color',''); 
			if(!$.trim($(this).val())){ //if this field is empty 
				$(this).css('border-color','red'); //change border color to red   
				proceed = false; //set do not proceed flag
			}
			//check invalid email
			var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
			if($(this).attr("type")=="email" && !email_reg.test($.trim($(this).val()))){
				$(this).css('border-color','red'); //change border color to red   
				proceed = false; //set do not proceed flag				
			}	
			
		}).keyup(function() { //reset previously set border colors on .keyup()
			$(this).css('border-color',''); 
		}).change(function() {  //for select box
			$(this).css('border-color',''); 
		});	
		
		if(proceed){ //everything looks good! proceed...
			//get input field values data to be sent to server
			var post_url = $(this).attr("action"); //get form action url
			var request_method = $(this).attr("method"); //get form GET/POST method
			var form_data = $(this).serialize(); //Encode form elements for submission
			
			//Ajax post data to server
			$.ajax({
				url : post_url,
				type: request_method,
				dataType : 'json',
				data : form_data
			})
			.done(function(response){
				if(response.type == 'error'){ //load json data from server and output message     
					output = '<p class="form-message form-error">'+response.text+'</p>';
				}else{
					$(form)[0].reset(); //reset this form upon success
					output = '<p class="form-message form-success">'+response.text+'</p>';
				}
				results.removeClass('hidden').html(output);
				setTimeout(function() {
					results.addClass('hidden').html('');
				}, 7000);
			});
		}
	});

})(jQuery);