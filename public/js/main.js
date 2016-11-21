$(function(){
	$('.type_module').hide();
	
	$('#'+$('input:radio[name="ticket_type"]').val()).show();

	$('input:radio[name="ticket_type"]').change(function(){
		var rem = $(this).val();
		$('.type_module').hide();
		$('#'+rem).show();
	});

	$('#document_fill').change(function(){
		$('#documentModal').modal();
	});

}());