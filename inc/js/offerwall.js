jQuery(document).ready(function() {
    
    function isEmail(email) {
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
    }
                            
    function DropDown(el) {
            this.dd = el;
            this.initEvents();
    }
    DropDown.prototype = {
            initEvents : function() {
                    var obj = this;
                    obj.dd.toggleClass('active');
//                    obj.dd.on('click', function(event){
//                            $(this).toggleClass('active');
//                            event.stopPropagation();
//                    });	
            }
    }
    $(function() {

            var dd = new DropDown( $('#dd') );
            $(document).click(function() {
                    // all dropdowns
                    //$('.wrapper-dropdown-2').removeClass('active');
            });

    });
    
    $('.web2mob').click(function(){
        $('.alert').hide();
        $('#sendEmail').prop('disabled', false);
        var oname = $(this).data("offername");
        var reward = $(this).data("reward");
        var thumbnail = $(this).data("thumb");
        var description = $(this).data("desc");
        var device = $(this).data("device");
        var tracking = $(this).data("tracking");
        $('#modalOName').text(oname);
        $("#thumbIMG").attr("src",thumbnail);
        $("#rewardBtn").html(reward);
        $("#deviceBtn").html(device);
        $("#tracking").val(tracking);
        var descriptionHTML = '<span index="0" class="text-muted"> 1. Enter your email to receive the offer link on your phone.<br></span>';
        descriptionHTML += '<span index="1" class="text-muted"> 2. Click the link from your smartphone or tablet.<br></span>';
        descriptionHTML += '<span index="2" class="text-muted"> 3. '+description+'<br></span>'
        $('#descriptionDiv').html(descriptionHTML);
        $("#sendEmail").html(" Send email to phone to earn "+reward);
    });
    
    $('#sendEmail').click(function (e) {
            e.preventDefault();
            $('.alert').hide();
            var fData = $('#send_tracking').serialize();
            if (!isEmail($('#email').val()) || !$('#chkTerms').is(':checked') ) { 
               $('.alert').html('Enter a valid email and make sure checkbox is checked!');
               $('.alert').removeClass("alert-success");
               $('.alert').addClass("alert-danger");
               $('.alert').show();
            } else {
                $('#sendEmail').prop('disabled', true);
                $.ajax({
                    type: 'POST',
                    url: 'sendLink.php?offer='+$('#modalOName').text()+'&reward='+$("#rewardBtn").html()+'&device='+$("#deviceBtn").html(),
                    data: fData,
                    dataType: 'json'
                    }).success(function(response) {
                        if (response && response.sent) {
                            $('.alert').html('Email sent successfully!');
                            $('.alert').removeClass("alert-danger");
                            $('.alert').addClass("alert-success");
                        } else {
                            if (response.sent === 0){
                                $('.alert').html('There was a problem sending the email.');}
                            else {$('.alert').html(response);}
                            $('.alert').removeClass("alert-success");
                            $('.alert').addClass("alert-danger");
                        }
                        $('.alert').show();
                    }).error(function() {
                        $('.alert').html('Error Sending Link!');
                        $('.alert').removeClass("alert-success");
                        $('.alert').addClass("alert-danger");
                        $('.alert').show();
                    });
            }           
    });
    
    $('.hrefsupport').click(function(){
        var pubid = $(this).data("pubid");
        var subid = $(this).data("subid");
        
        var table = $('#offers');
        var oTable = table.dataTable({
                    "bDestroy": true,
                    "bProcessing": true,
                    "aLengthMenu": [
                        [5, 10],
                        [5, 10] // change per page values here
                    ],
                    "iDisplayStart": 0,
                    "iDisplayLength": 5,
                    "sPaginationType": "full_numbers",
                    "columnDefs": [ {
                        "orderable": false,
                        "targets": [4]
                    },
                    {
                        "searchable": false,
                        "targets": [4]
                    }],
                    "aaSorting": [[ 3, "desc" ]],
                    "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
                    "oLanguage": {
                            "sLengthMenu": "_MENU_ per page",
                            "oPaginate": {
                                "sEmptyTable": "No Offers",
                                "sZeroRecords": "No Offers to Display",
                                "sPrevious": "Prev",
                                "sNext": "Next"
                            }
                    },
                    sAjaxSource: "getUserOffers.php?pubid="+pubid+"&subid="+subid
                });
        
    });
    
});