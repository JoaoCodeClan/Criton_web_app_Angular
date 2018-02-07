import { Component, OnInit, ViewEncapsulation, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { } from '@types/googlemaps';
@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  @ViewChild('googlemap') googlemapElement: any;
  public map: google.maps.Map;
  public latOutput;
  public lngOutput;
  addressForm : FormGroup;

  constructor(private _ngZone: NgZone) { }

  ngOnInit() {
    this.latOutput ="";
    this.lngOutput ="";
    this.addressForm = new FormGroup({
      selectedAddress : new FormControl('',{
        validators: Validators.required,
        updateOn:'change'
      })

    });

    var googleMap = {
      center: new google.maps.LatLng(0.0,-0.0),
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.googlemapElement.nativeElement, googleMap);

  }


  handleAddressInput(event){

    if(event.key== "Enter"){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address':this.addressForm.value.selectedAddress }, function(results, status) {
        if (status === 'OK') {
          const result = results[0].geometry.location;
          const lat = result.lat();
          const lng = result.lng();

          this._ngZone.run(() => {
                      this.latOutput =lat;
                      this.lngOutput =lng;
                    });

          var updatedGoogleMap = {
            center: new google.maps.LatLng(lat,lng),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          this.map = new google.maps.Map(this.googlemapElement.nativeElement, updatedGoogleMap);
          var coords ={
            lat:lat,
            lng: lng
          }
          var marker = new google.maps.Marker({
            position: coords,
            map: this.map,
            animation: google.maps.Animation.DROP
          });


        }else{alert("Address not found.Please check if address is correct.")};

      }.bind(this));
    }
  }


}
