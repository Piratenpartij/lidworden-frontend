import React, {Component} from 'react';
import {
  Grid,
  Row,
  Col,
  Button,
  Input,
  Image
} from 'react-bootstrap';
import LogoImg from './img/PPLogo-st-black.svg';
import OurInput from './OurInput';
import OurForm from './OurForm';
import validator from 'validator';
import update from 'react-addons-update';
import 'whatwg-fetch';
import promise from 'es6-promise';
import debounce from 'es6-promise-debounce';


class Lidworden extends Component {

  constructor() {
    super();
    this.state = {
      formValues: {
        telefoon: '',
        tussenvoegsel: ''
      },
      screenMode: "form"
    }

    this.debouncedFunction = debounce(function() {
      return new Promise(function(resolve) {
        resolve();
      });
    }, 300);

  }

  telefoonValidator(value) {
    if (value.match(/^0[0-9]{9}$/)) {
      return true;
    } else {
      return false;
    }
  }

  telefoonModifier(value) {
    if (value && value.match(/^[1-9]/)) {
      value = '0' + value;
    }
    if (value.match(/^00/)) {
      value = '0';
    }
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    return value.replace(new RegExp('[^0-9]', 'g'), '');
  }

  emailHerhalingValidator(value) {
    if (this.state.formValues.email == this.state.formValues.emailHerhaling) {
      return true;
    }

    return false;
  }

  postcodeModifier(value) {
    value = value.toUpperCase();
    value = value.replace(new RegExp('[^0-9A-Z]', 'g'), '');
    value = value.substring(0, 6);
    return value;
  }

  huisnummerModifier(value) {
    return value.replace(new RegExp('[^0-9]', 'g'), '');
  }

  postcodeValidator(value) {
    if (this.state.checkedAddress && this.state.checkedAddress.postcode) {
      return true;
    }
    return false;
  }

  huisnummerValidator(value) {
    if (this.state.checkedAddress && this.state.checkedAddress.huisnummer) {
      return true;
    }
    return false;
  }

  onChange(key, val) {
    this.setState(update(this.state, {
      formValues: {
        [key]: {
          $set: val
        }
      }
    }));

    if (key == 'postcode' || key == 'huisnummer' || key == 'huisletter' || key == 'huisnummertoevoeging') {
      let curVal = this.state.formValues;
      curVal[key] = val;
      this.setState({checkedAddress: null});
      this.debouncedFunction().then(() => this.lookupAddress(curVal.postcode, curVal.huisnummer, curVal.huisletter, curVal.huisnummertoevoeging));
    }
  }

  lookupAddress(postcode, huisnummer, huisletter, huisnummertoevoeging) {
    let baseUrl = 'https://lidworden.piratenpartij.nl/cgi-bin/adres.pl';

    if (!postcode) {
      postcode = '';
    }
    postcode = postcode.replace(' ', '').toUpperCase();
    var ourUrl : string = baseUrl + '/' + postcode + '/' + huisnummer + '/' + huisletter + '/' + huisnummertoevoeging;
    ourUrl = ourUrl.replace(/\/+$/, "");

    fetch(ourUrl).then((response) => response.json()).then((responseData) => {
      this.setState({checkedAddress: responseData});
    });

  }

  onSubmit() {
    this.setState({screenMode: 'submitting'});
    let url = 'https://lidworden.piratenpartij.nl/cgi-bin/newmember.pl';

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        voornaam: this.state.formValues.voornaam,
        tussenvoegsel: this.state.formValues.tussenvoegsel,
        achternaam: this.state.formValues.achternaam,
        postcode: this.state.checkedAddress.postcode,
        huisnummer: this.state.checkedAddress.huisnummer,
        huisletter: this.state.checkedAddress.huisletter,
        huisnummertoevoeging: this.state.checkedAddress.huisnummertoevoeging,
        email: this.state.formValues.email,
        telefoon: this.state.formValues.telefoon,
        straat: this.state.checkedAddress.straat,
        plaats: this.state.checkedAddress.woonplaats
      })
    }).then(response => response.json()).then(responseData => {

      if (responseData.ok == 1) {
        this.setState({screenMode: 'submitted'});
      } else {
        this.setState({screenMode: 'error'});
      }
    }).catch((error) => {
      this.setState({screenMode: 'error'});
    });

  }

  render() {

    let adresBlok;
    let huisletterLijst;
    let huisnummertoevoegingLijst;

    if (this.state.checkedAddress) {
      if (this.state.checkedAddress.adres_id) {
        let adr = this.state.checkedAddress;

        let adresRegel = adr.straat + " " + adr.huisnummer;
        if (adr.huisletter && adr.huisletter != '-') {
          adresRegel += " " + adr.huisletter
        }
        if (adr.huisnummertoevoeging && adr.huisnummertoevoeging != '-') {
          adresRegel += " " + adr.huisnummertoevoeging
        }

        let adresRegel2 = adr.postcode + " " + adr.woonplaats;

        adresBlok = <Row>
          <Col xs={12} sm={6}>
            <div className="form-group has-feedback has-success">
              <label className="control-label">
                <span>Adres</span>
              </label>
              <p className="form-control form-control-success form-control-static" style={{
                height: 'auto'
              }} disabled>
                {adresRegel}
                <br/> {adresRegel2}
              </p>
              <span className="glyphicon glyphicon-ok form-control-feedback"></span>
            </div>
          </Col>
        </Row>;

      }

      if (this.state.checkedAddress.huisletter_lijst) {
        huisletterLijst = <OurInput xs={12} sm={3} type="select" label="Huisletter" required name="huisletter" dirty>
          <option key="" value="">Kies...</option>
          {this.state.checkedAddress.huisletter_lijst.map(letter => <option key={letter} value={letter}>{letter == '-'
              ? '-geen-'
              : letter}</option>)}
        </OurInput>
      }

      if (this.state.checkedAddress.huisnummertoevoeging_lijst) {
        huisnummertoevoegingLijst = <OurInput xs={12} sm={3} type="select" label="Huisnummertoevoeging" required name="huisnummertoevoeging" dirty>
          <option>Kies...</option>
          {this.state.checkedAddress.huisnummertoevoeging_lijst.map(letter => <option key={letter} value={letter}>{letter == '-'
              ? '-geen-'
              : letter}</option>)}
        </OurInput>

      }
    }

    if (!adresBlok) {
      adresBlok = <Row>
        <Col xs={12} sm={6}>
          <div className="form-group has-feedback">
            <label className="control-label">
              <span>Adres</span>
            </label>
            <p className="form-control form-control-static" style={{
              height: 'auto'
            }} disabled>
              &nbsp;
              <br/>
              &nbsp;
            </p>
            <span className="glyphicon form-control-feedback"></span>
          </div>
        </Col>
      </Row>;

    }

    let screenContent;

    if (this.state.screenMode == 'form') {
      screenContent = <Row>
        <Col xs={12} md={4}>
          <h1>Lid worden</h1>
          <p>Mooi, je wilt dus lid worden!</p>
          <p>Vul het formulier in en klik op verzenden.</p>
          <p>Velden gemarkeerd met * zijn verplicht.</p>
	  <p>Na het invullen van postcode & huisnummer wordt het adres automatisch ingevuld.</p>
        </Col>
        <Col xs={12} md={8}>
          <OurForm onSubmit={this.onSubmit.bind(this)} onChange={this.onChange.bind(this)} valueObject={this.state.formValues}>
            <Row>
              <OurInput xs={12} sm={4} label="Voornaam" required name="voornaam"/>
              <OurInput xs={12} sm={3} label="Tussenvoegsel" name="tussenvoegsel"/>
              <OurInput xs={12} sm={5} label="Achternaam" required name="achternaam"/>
            </Row>
            <Row>
              <OurInput xs={12} sm={3} label="Postcode" required modifier={this.postcodeModifier} validator={this.postcodeValidator.bind(this)} name="postcode"/>
              <OurInput xs={12} sm={3} label="Huisnummer" required name="huisnummer" modifier={this.huisnummerModifier} validator={this.huisnummerValidator.bind(this)} type="number"/> {huisletterLijst}
              {huisnummertoevoegingLijst}
            </Row>
            {adresBlok}
            <Row>
              <OurInput xs={12} sm={6} label="E-mailadres" required validator={validator.isEmail} name="email" type="email"/>
              <OurInput xs={12} sm={6} label="E-mailadres (herhaling)" required validator={this.emailHerhalingValidator.bind(this)} name="emailHerhaling" type="email"/>
            </Row>
            <Row>
              <OurInput xs={12} label="Telefoonnummer" validator={this.telefoonValidator} modifier={this.telefoonModifier} name="telefoon" type="tel"/>
            </Row>
            <Row>
              <Col xs={12}>
                <Button type="submit">Verzenden</Button>
              </Col>
            </Row>
          </OurForm>
        </Col>
      </Row>
    } else if (this.state.screenMode == 'submitted') {
      screenContent = <div>
        Bedankt voor je aanmelding!
        <br/><br/>
        Er volgt nu een handmatige controle, waarna we per e-mail contact met je zullen opnemen over de eerste contributiebetaling.
      </div>;
    } else if (this.state.screenMode == 'error') {
      screenContent = <div>
        Er is iets fout gegaan bij het versturen van de gegevens.. Neem bij aanhoudende problemen s.v.p. contact op met ict@piratenpartij.nl !
      </div>
    } else if (this.state.screenMode == 'submitting') {
      screenContent = <div>
        even geduld...
      </div>
    }

    return (
      <Grid>
        <div className="page-header">
          <Image src={LogoImg} responsive/>
        </div>
        {screenContent}
      </Grid>
    );
  }
}

export default Lidworden
