<?php
if($_POST)
{
	$to_email = "info@liquid-themes.com"; //Recipient email, Replace with own email here
	$subject  = "An email from my website contact form";
	
	//check if its an ajax request, exit if not
	if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
		
		$output = json_encode(array( //create JSON data
			'type'=>'error', 
			'text' => 'Sorry Request must be Ajax POST'
		));
		die($output); //exit script outputting json data
	} 
	
	//Sanitize input data using PHP filter_var().
	$user_name		= filter_var($_POST["name"], FILTER_SANITIZE_STRING);
	$user_email		= filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
	$message		= filter_var($_POST["message"], FILTER_SANITIZE_STRING);
	
	//additional php validation
	if(strlen($user_name) < 2){ // If length is less than 4 it will output JSON error.
		$output = json_encode(array('type'=>'error', 'text' => 'Name is too short or empty!'));
		die($output);
	}
	if(!filter_var($user_email, FILTER_VALIDATE_EMAIL)){ //email validation
		$output = json_encode(array('type'=>'error', 'text' => 'Please enter a valid email!'));
		die($output);
	}
	
	//email body
	$message_body = $message."\r\n\r\n-".$user_name."\r\nEmail: ".$user_email."\r\n" ;
	
	//proceed with PHP email.
	$headers = 'From: '. $user_email .'' . "\r\n" .
	'Reply-To: '.$user_email.'' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();
	
	$send_mail = mail($to_email, $subject, $message_body, $headers);
	
	if(!$send_mail)
	{
		//If mail couldn't be sent output error. Check your PHP email configuration (if it ever happens)
		$output = json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
		die($output);
	}else{
		$output = json_encode(array('type'=>'message', 'text' => 'Hi '.$user_name .' Thank you for your email'));
		die($output);
	}
}
?>