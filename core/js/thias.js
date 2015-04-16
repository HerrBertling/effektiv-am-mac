/*

	S6
	---------------------

	@file 		thias.js
	@version 	1.0
	@date 		2010-11-14
	@author 	Matthias Edler-Golla <meg@wachenfeld-golla.de>

	Copyright (c) 2010 Wachenfeld + Golla, Buero fuer Gestaltung <http://wachenfeld-golla.de>

*/
$(function(){
	$('html').addClass('jsAktiv');
});

$(function(){
	$('article:not(:first)').hide();
	$('article:first').addClass('sichtbar');
	$('body a, body div#index, body p#back, form, video, audio').click(function(e){e.stopPropagation();});
	$('article').bind('click',function(e){
		weiterGehen()
	});
	
	$(document).keydown(function(event) {
		
		//var taste = event.keyCode;
		//alert (taste);
		
		var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
		var artikelAnzahl = $('div#wrap article').length;
		
		if (event.keyCode == '39') { //rechts = weiter
			weiterGehen()
		}
		
		if (event.keyCode == '37') { //links = zurueck
			zurueckGehen();
		}
		
		if (event.keyCode == '32') { // Space
			$('div#inhaltsangabe').toggle('fast');
			hilfeVerbergen();
			return false;
		}
		
		if (event.keyCode == '48') { // Null
			$('article:not(:first)').hide().removeClass('sichtbar');
			$('article:first').fadeIn(600).addClass('sichtbar');
			warnungVerbergen();
			hilfeVerbergen();
			aktuelleArtikelNummerEintragen();
		}
		if (event.keyCode == '67') { // C
			var c = $('article').attr('class');
			//alert (c);
			if (c.indexOf('pointerCursor')!=-1){
				$('article.sichtbar').removeClass('pointerCursor');
			} else {
				$('article.sichtbar').addClass('pointerCursor');
			}
		}
		if (event.keyCode == '189' || event.keyCode == '0') { // Fragezeichen
			hilfeZeigen();
		}
		
	});
});

$(function(){
	$('h1#titel').click(function(){
		hilfeZeigen();
	});
});
function hilfeZeigen(){
	if ($('div#hilfe').length == 0) {
			$('div#wrap').append('<div id="hilfe"></div>');
			$('div#hilfe').hide();
	}
	$('div#hilfe').toggle('fast');
	
	$('div#hilfe').load('../../meta/core/hilfe.html article.hilfe');
}


function hilfeVerbergen(){
	$('div#hilfe article').fadeOut('slow');
}

function ArtikelAustauschen(bisherArtikel, neuArtikel){
	$(bisherArtikel).hide().removeClass('sichtbar');
	$(neuArtikel).fadeIn(600).addClass('sichtbar');
}
$(function(){
	$('article h1').clone().appendTo('div#inhaltsangabe');
	
	$('div#inhaltsangabe h1').each(function(index){
   		$(this).wrap('<a href="#A_' + ((index-1)+1) + '" title="Springt zum jeweiligen Artikel"><\/a>');
   	});
   	$('div#wrap article').each(function(index){
   		$(this).attr({
   			id: 'A_' + ((index-1)+1)
   		});	
   	});   	
   	var artikelAnzahl = ($('div#wrap article').length)-1;
   	$('h2#Seitenanzeige strong').text(artikelAnzahl);
   	if (artikelAnzahl >= 15){
   		$('div#inhaltsangabe').addClass('vieleEintraege');
   	}
   	
   	aktuelleArtikelNummerEintragen();
});
function aktuelleArtikelNummerEintragen(){
   	var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
   	$('h2#Seitenanzeige span').text(aktuelleArtikelNummer);
   	
   	aktivenArtikelMarkieren(aktuelleArtikelNummer);
   	
   	zurueckButtonAusblenden(aktuelleArtikelNummer)
}

function zurueckButtonAusblenden(ziffer){
	if (ziffer == 0){
		$('p#back').hide();
	} else {
		$('p#back').show();
	}
}

function aktuelleArtikelNummerFinden(){
	var aktuellerArtikel = $('article.sichtbar').attr('id');
   	var aktuelleArtikelNummer = parseInt(aktuellerArtikel.slice(2));
   	return aktuelleArtikelNummer;
}

function aktivenArtikelMarkieren(ziffer){
	$('div#inhaltsangabe h1.aktiv').removeClass('aktiv');
	var x = 'div#inhaltsangabe h1:eq(' + ziffer + ')';
	$(x).addClass('aktiv');
}
$(function(){
   	$('div#inhaltsangabe').hide();
   	$('div#index').click(function(){
   		warnungVerbergen();
   		$('div#inhaltsangabe').show('fast');
   	});
   	
   	$('div#inhaltsangabe a').click(function(){
   		var ziel = $(this).attr('href');
   		var zielArtikel = 'article' + ziel; 		
   		var aktArtikel = $('article.sichtbar')
   		$('div#inhaltsangabe').hide('slow');
   		ArtikelAustauschen(aktArtikel, zielArtikel)
   		aktuelleArtikelNummerEintragen();
   		return false;
   	});
});
$(function(){
	$('p#back').click(function(){
		zurueckGehen();
	});
});
function weiterGehen(){
	$('div#inhaltsangabe').hide();
	var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
	var artikelAnzahl = $('div#wrap article').length;
	
	if (aktuelleArtikelNummer < (artikelAnzahl - 1)){
		var aktArtikel = 'article#A_' + aktuelleArtikelNummer;
		var nextArtikel = 'article#A_' + (aktuelleArtikelNummer +1);

		ArtikelAustauschen(aktArtikel, nextArtikel)
	
		aktuelleArtikelNummerEintragen();
		warnungVerbergen();
	} else {
		warnungZeigen('letzter Slide der Präsentation…');
	}
	
	hilfeVerbergen();
}

function zurueckGehen(){
	$('div#inhaltsangabe').hide();
	var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
	
	if (aktuelleArtikelNummer > 0){
		var aktArtikel = 'article#A_' + aktuelleArtikelNummer;
		var lastArtikel = 'article#A_' + (aktuelleArtikelNummer -1);

		ArtikelAustauschen(aktArtikel, lastArtikel)
	
		aktuelleArtikelNummerEintragen();
		warnungVerbergen();
	} else {
		warnungZeigen('erster Slide der Präsentation…');
	}
	
	hilfeVerbergen();
}
$(function(){
	$('article a[href]').each(function(index){
		var myRef = $(this).attr('href');
   			$(this).addClass('echtLink');
			$(this).attr('target', '_blank');
		//}
   	});
});
$(function(){
	var ha = window.location.hash;
	if (ha.length > 0) {
		var aktArtikel = $('article:first')
		var hashArtikel = 'article' + ha;
		var gekuerzt = ha.slice(3);
		var hashnummer = parseInt(gekuerzt);
		var artikelAnzahl = $('div#wrap article').length;
		
		if (hashnummer < artikelAnzahl){
			ArtikelAustauschen(aktArtikel, hashArtikel);
			aktuelleArtikelNummerEintragen();
			warnungVerbergen();
		}
	}
});
$(function(){
	$('body').append('<div id="warnung"><p></p></div>');
	
	$('div#warnung').hide();
	
	$('div#warnung p').click(function(){
		warnungVerbergen();
		return false;
	});
});

function warnungZeigen(Meldung){
	$('div#warnung p').text(Meldung);
	$('div#warnung').fadeIn('slow');
}

function warnungVerbergen(){
	$('div#warnung').fadeOut('slow');
}