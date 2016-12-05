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

	$('#selectHandler').val('others')
	$('#handlerName').val(' ');
	$('#handlerLocation').val(' ');
	$('#handlerContact').val(' ');
	$('#handlerEmail').show();
	
	$('#selectHandler').change(function(){
		var value = $(this).val();

		if(value=='userA'){
			$('#handlerName').val('Ravi Kumar');
			$('#handlerLocation').val('Flat-34/12 , New Delhi');
			$('#handlerContact').val('7878787878');
			$('#handlerEmail').hide();
		}else{
			$('#handlerName').val(' ');
			$('#handlerLocation').val(' ');
			$('#handlerContact').val(' ');
			$('#handlerEmail').show();
		}
	});
}());