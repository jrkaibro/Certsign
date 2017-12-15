function Certisign($)
{
	this.Certificate;
	this.ListCertificates;
	this.Width;
	this.Height;
	this.Version;
	this.RuntimeMode;

	// Databinding for property Certificate
	this.SetCertificate = function(data)
	{
		///UserCodeRegionStart:[SetCertificate] (do not remove this comment.)
		this.Certificate = data;
		
		
		
		
		
		
		
		
		
		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	// Databinding for property Certificate
	this.GetCertificate = function()
	{
		///UserCodeRegionStart:[GetCertificate] (do not remove this comment.)
		return this.Certificate;
		
		
		
		
		
		
		
		
		
		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	// Databinding for property ListCertificates
	this.SetListCertificates = function(data)
	{
		///UserCodeRegionStart:[SetListCertificates] (do not remove this comment.)
		this.ListCertificates = data;
		
		
		
		
		
		
		
		
		
		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	// Databinding for property ListCertificates
	this.GetListCertificates = function()
	{
		///UserCodeRegionStart:[GetListCertificates] (do not remove this comment.)
		return this.ListCertificates;
		
		
		
		
		
		
		
		
		
		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	// Databinding for property RuntimeMode
	this.SetRuntimeMode = function(data)
	{
		///UserCodeRegionStart:[SetRuntimeMode] (do not remove this comment.)


		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	// Databinding for property RuntimeMode
	this.GetRuntimeMode = function()
	{
		///UserCodeRegionStart:[GetRuntimeMode] (do not remove this comment.)


		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	this.show = function()
	{
		///UserCodeRegionStart:[show] (do not remove this comment.)

		var mode 		  = this.RuntimeMode
		var containerName = this.ContainerName		

		blockUI = new function() {  

			var start = function (msg) {
				
				if (msg) {
				    message(msg);
				} else {
				    message('Loading ...');
				}
				
				$.blockUI({ message: $('#blockPanel') });
			};

			var message = function (msg) {				
				$.blockUI(msg);				
			};

			var stop = function() {
				$.unblockUI();
			};

			this.start   = start;
			this.message = message;
			this.stop    = stop;
		};	

		init();

		/*
	 		"1" "Signature PDF" 
	        "2" "Signature XML" 
	        "3" "Authentication" 
	        "4" "List Certicates" 
	        "5" "Upload Certificate" 
        */

		switch(mode) {
		    case "1": //"Signature PDF" 
		         console.log(mode);
		        break;
		    case "2": // "Signature XML" 
		        console.log(mode);
		        break;
		    case "3": // "Authentication" 		     	
			 	html +=  '<div id="signatureControlsPanel" style="display: block;">'
       		 	html += 	'<select id="certificateSelect" class="form-control Attribute" >'
				html += 	'<option value="">Choose a certificate ...</option>'
				html += 	'</select>'
			 	html += '</div>'			 	
			 	render(html,this.ContainerName);
			 	loadCertificates();
		        break;
		    case "4": // "List Certicates" 
		        console.log(mode);
		        break;		        		        
		    case "5": // "Upload Certificate" 
		        console.log(mode);
		        break;		        
		    default:
		        console.log('not defined runtime mode');
		}
		
		
		
		
		
		
		
		
		
		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}
	///UserCodeRegionStart:[User Functions] (do not remove this comment.)

	var html = "";

	function init(){

		pki.init({
	    	ready: onWebPkiReady,
	    	notInstalled: onWebPkiNotInstalled,
	    	defaultError: onWebPkiError
		});

		function onWebPkiError(message, error, origin) {
		    blockUI.stop();
		    console.log('Web PKI error originated at ' + origin + ': ' + error);	   
		}

		function onWebPkiNotInstalled (status, message) {
		    console.log('Installation NOT ok: ' + message);
		    blockUI.stop();
		    confirm('Click OK to go to installation page');	    
		    pki.redirectToInstallPage();	   
		}

		function onWebPkiReady () {
			// Verificar o PKI 
		}
	}

	function render(doc,ctx){
	  	$('#'+ctx).append(doc);			  	
	}

	function loadCertificates() {
	    log('Listing certificates ...');
	    pki.listCertificates().success(function (certificates) {
	        log('Certificates listed.');
	        var select = $('#certificateSelect');
	        $.each(certificates, function() {
	            select.append(
	                $('<option />').val(this.thumbprint).text(this.subjectName + ' (issued by ' + this.issuerName + ')')	                
	            );
	        });
	        $('#signatureControlsPanel').show();
	        blockUI.stop();
	    });


	    $("#certificateSelect").change(function(){    		
    		
    		var certs = $(this).val();
    		var jsonCert = null;

    		pki.listCertificates().success(function (certs) {
			    for (var i = 0; i < certs.length; i++) {
			        var cert = certs[i];
			       // jsonCert = JSON.stringify(cert);			        
			        console.log(jsonCert);
			    }
			});

    		//pki.readCertificate($(this).val()).success(onReadCertificateCompleted);
		});
	}


	// This function is the callback for when the readCertificate operation is completed
	function onReadCertificateCompleted(certEncoding) {
	    log('Certificate binary encoding read, sending to server ...');
	    blockUI.message('Signing ... (step 2/4)');
	    // Now that we have acquired the certificate's encoding, we'll send that to the
	    // server using Ajax
	    $.ajax({
	        url: 'https://webpki.lacunasoftware.com/api/Signature/Start',
	        method: 'POST',
	        contentType: 'application/json',
	        data: JSON.stringify({
	            certificate: certEncoding
	        }),
	        dataType: 'json',
	        success: onSignatureStartCompleted
	    });
	}

	// This function is the callback for when the server replies back with the "to-sign-bytes"
	// and digest algorithm oid.
	function onSignatureStartCompleted(response) {
	    log('Received response from server with bytes to sign and digest algorithm');
	    log('toSign: ' + response.toSign);
	    log('digestAlgorithmOid: ' + response.digestAlgorithmOid);
	    log('Signing ...');
	    blockUI.message('Signing ... (step 3/4)');
	    signatureProcessId = response.processId;
	    pki.signData({
	        thumbprint: $('#certificateSelect').val(),
	        data: response.toSign,
	        digestAlgorithm: response.digestAlgorithmOid
	    }).success(onSignDataCompleted);
	}

	// This function is the callback for when the signData operation is completed
	function onSignDataCompleted(signature) {
	    log('Signature completed, submitting to server ...');
	    blockUI.message('Signing ... (step 4/4)');
	    // We send the signature result back to the server, which will then use
	    // its server-side SDK to assemble the signed PDF file
	    $.ajax({
	        url: 'https://webpki.lacunasoftware.com/api/Signature/Complete',
	        method: 'POST',
	        contentType: 'application/json',
	        data: JSON.stringify({
	            processId: signatureProcessId,
	            signature: signature
	        }),
	        success: onSignatureCompleteCompleted
	    });
	}

	
	
	
	
	
	
	
	
	
	
	
	///UserCodeRegionEnd: (do not remove this comment.):
}
