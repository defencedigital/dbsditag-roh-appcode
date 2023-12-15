import { Injectable } from '@nestjs/common';
import { InputTypeString, TableNames } from 'src/types/types';
import { env } from "node:process";
const fs = require('fs');

@Injectable()
export class ConfigService {
  static YES = 'Yes';
  static NO = 'No';
  static INDEX = 'index';

  static SECTION_SERVICE = 1;
  static SECTION_DETAILS = 2;
  static SECTION_RESULT = 4;

  static SECTION_PATHS = {
    [ConfigService.SECTION_SERVICE]: '/service',
    [ConfigService.SECTION_DETAILS]: '/details',
    [ConfigService.SECTION_RESULT]: '/result',
  };

  static SECTION_NAMES = Object.entries(ConfigService.SECTION_PATHS).reduce(
    (obj, [key, value]) => ({ ...obj, [value]: key }),
    {},
  );

  static formKeys = {
    SERVICE: 'service',
    FIRST_NAME: 'firstname',
    SURNAME: 'surname',
    SERVICE_NUMBER: `service_number`,
  };

  static QUESTION_TEXT = {
    [ConfigService.formKeys.SERVICE]: 'select service',
    [ConfigService.formKeys
      .FIRST_NAME]: `First name(s) or initial(s) (optional)`,
    [ConfigService.formKeys.SURNAME]: `Last name`,
    [ConfigService.formKeys.SERVICE_NUMBER]: `Service number`,
  };

  static ROYAL_FLEET_AUXILIARY = 'Royal Fleet Auxiliary';
  static ROYAL_NAVY = 'Royal Navy';
  static ROYAL_AIR_FORCE = 'Royal Air Force';
  static ARMY = 'Army';
  static MERCHANT_NAVY = 'Merchant Navy';

  static SERVICE_BRANCHES = [
    'Any',
    'Royal Navy',
    'Royal Marines',
    'Royal Air Force',
    'Army',
  ];

  static OPTIONS_SERVICE_BRANCHES = ConfigService.SERVICE_BRANCHES.map(
    (branch, index) => ({
      text: branch,
      value: index === 0 ? branch.toLowerCase() : branch,
    }),
  );

  static OPTIONS_YES_OR_NO = [
    { value: 'Yes', text: 'Yes' },
    { value: 'No', text: 'No' },
  ];

  static questionAnswers = {
    [ConfigService.formKeys.SERVICE]: ConfigService.OPTIONS_SERVICE_BRANCHES,
  };

  constructor( ) {
    this.loadFromVault()
  }

  async loadFromVault() {

    let secretToken = env['VAULT_SECRET']
    const secretLocation = '/var/run/secrets/kubernetes.io/serviceaccount/token'

    if(fs.existsSync(secretLocation)) {
        secretToken = fs.readFileSync(secretLocation, 'utf8')
    }

    const content = await fetch(`${env['VAULT_ADDR']}/auth/kubernetes/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vault-Namespace': env['VAULT_NAMESPACE'],
      },
      body: JSON.stringify({
        role: env['VAULT_ROLE'],
        jwt: secretToken
      })
    })

    const json = await content.json()

    if(json.auth) {
      const token = json.auth.client_token

      const secrets = await fetch(`${env['VAULT_ADDR']}/${env['VAULT_KEY']}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Vault-Namespace': env['VAULT_NAMESPACE'],
          'X-Vault-Token': token
        }
      });
      const secretsJson = await secrets.json()
      const secretData = secretsJson.data.data
    }

    return
  }

  get(key: string, obj?: string): string {
    return ConfigService[key] ?? env[key] ?? false;
  }

  getSectionPaths() {
    return ConfigService.SECTION_PATHS;
  }

  getSectionFromPath(path: string): string {
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    return String(ConfigService.SECTION_NAMES[path]);
  }

  static SECTION_COMPLETE = 'section-complete';

  static inputTypes: Record<string, InputTypeString> = {
    CHECKBOXES: 'checkboxes',
    UPLOAD: 'upload',
    INPUT: 'input',
  };

  static PKID = 'pkid';
  static ID = 'id';
  static SERIAL_NO = 'serial_no';
  static SURNAME = 'surname';
  static FORENAMES = 'forenames';
  static GENDER = 'gender';
  static DECORATIONS = 'decorations';
  static RANK = 'rank';
  static SERVICE_NO = 'service_no';
  static REGT_CORPS = 'regt_corps';
  static SERVICE = 'service';
  static BIRTH_DATE = 'birth_date';
  static MEMORIAL = 'memorial';
  static NOM_ROLL = 'nom_roll';
  static AGE = 'age';
  static DEATH_DATE = 'death_date';
  static CEMETARY_NAME = 'cemetery_name';
  static CEMETARY_ADDRESS_1 = 'cemetery_address_1';
  static CEMETARY_ADDRESS_2 = 'cemetery_address_2';
  static CEMETARY_ADDRESS_3 = 'cemetery_address_3';
  static CEMETARY_ADDRESS_4 = 'cemetery_address_4';
  static CEMETARY_POSTCODE = 'cemetery_postcode';
  static GRAVE_SECTION = 'grave_section';
  static GRAVE_ROW = 'grave_row';
  static GRAVE_NUMBER = 'grave_number';
  static HEADSTONE_INSCRIPTION = 'headstone_inscription';
  static SERVICEPERSON = 'serviceperson';

  static UPDATE_DATA = 'update-data';
  static KEEP_ALL = 'keep-all';
  static CONFIRM_DATA = 'confirm-data';
  static TRANSFER = 'transfer';
  static SUCCESS = 'success';
  static MODLOGIN = 'modlogin';

  static DELETE = 'DELETE';
  static FROM = 'FROM';
  static INTO = 'INTO';
  static SELECT = 'SELECT';
  static INSERT = 'INSERT';
  static ASC = 'ASC';
  static ROLL_OF_HONOUR_REPOSITORY = 'ROLL_OF_HONOUR_REPOSITORY';
  static REVISIONS_REPOSITORY = 'REVISIONS_REPOSITORY';
  static DATA_SOURCE = 'DATA_SOURCE';

  static SESSION = 'SESSION';

  static COOKIE_PREFENCES = 'cookie_preferences';

  static YES_OR_NO = [
    ConfigService.YES,
    ConfigService.NO,
    ConfigService.YES.toLowerCase(),
    ConfigService.NO.toLowerCase(),
    ConfigService.YES.toUpperCase(),
    ConfigService.NO.toUpperCase(),
  ];

  static colNames = {
    ID: ConfigService.ID,
    PKID: ConfigService.PKID,
    SERIAL_NO: ConfigService.SERIAL_NO,
    SURNAME: ConfigService.SURNAME,
    FORENAMES: ConfigService.FORENAMES,
    GENDER: ConfigService.GENDER,
    DECORATIONS: ConfigService.DECORATIONS,
    RANK: ConfigService.RANK,
    SERVICE_NO: ConfigService.SERVICE_NO,
    REGT_CORPS: ConfigService.REGT_CORPS,
    SERVICE: ConfigService.SERVICE,
    BIRTH_DATE: ConfigService.BIRTH_DATE,
    MEMORIAL: ConfigService.MEMORIAL,
    NOM_ROLL: ConfigService.NOM_ROLL,
    AGE: ConfigService.AGE,
    DEATH_DATE: ConfigService.DEATH_DATE,
    CEMETARY_NAME: ConfigService.CEMETARY_NAME,
    CEMETARY_ADDRESS_1: ConfigService.CEMETARY_ADDRESS_1,
    CEMETARY_ADDRESS_2: ConfigService.CEMETARY_ADDRESS_2,
    CEMETARY_ADDRESS_3: ConfigService.CEMETARY_ADDRESS_3,
    CEMETARY_ADDRESS_4: ConfigService.CEMETARY_ADDRESS_4,
    CEMETARY_POSTCODE: ConfigService.CEMETARY_POSTCODE,
    GRAVE_SECTION: ConfigService.GRAVE_SECTION,
    GRAVE_ROW: ConfigService.GRAVE_ROW,
    GRAVE_NUMBER: ConfigService.GRAVE_NUMBER,
    HEADSTONE_INSCRIPTION: ConfigService.HEADSTONE_INSCRIPTION,
  };

  static databaseCols = [
    ConfigService.colNames.ID,
    ConfigService.colNames.PKID,
    ConfigService.colNames.SERIAL_NO,
    ConfigService.colNames.SURNAME,
    ConfigService.colNames.FORENAMES,
    ConfigService.colNames.DECORATIONS,
    ConfigService.colNames.RANK,
    ConfigService.colNames.SERVICE_NO,
    ConfigService.colNames.REGT_CORPS,
    ConfigService.colNames.BIRTH_DATE,
    ConfigService.colNames.GENDER,
    ConfigService.colNames.SERVICE,
    ConfigService.colNames.MEMORIAL,
    ConfigService.colNames.NOM_ROLL,
    ConfigService.colNames.AGE,
    ConfigService.colNames.DEATH_DATE,
    ConfigService.colNames.CEMETARY_NAME,
    ConfigService.colNames.CEMETARY_ADDRESS_1,
    ConfigService.colNames.CEMETARY_ADDRESS_2,
    ConfigService.colNames.CEMETARY_ADDRESS_3,
    ConfigService.colNames.CEMETARY_ADDRESS_4,
    ConfigService.colNames.CEMETARY_POSTCODE,
    ConfigService.colNames.GRAVE_SECTION,
    ConfigService.colNames.GRAVE_ROW,
    ConfigService.colNames.GRAVE_NUMBER,
    ConfigService.colNames.HEADSTONE_INSCRIPTION,
  ];

  static headerMap = {
    PkId: 'pkid',
    SerialNo: 'serial_no',
    Surname: 'surname',
    Forenames: 'forenames',
    Gender: 'gender',
    Decorations: 'decorations',
    Rank: 'rank',
    ServiceNo: 'service_no',
    RegtCorps: 'regt_corps',
    BirthDate: 'birth_date',
    Service: 'service',
    Memorial: 'memorial',
    NomRoll: 'nom_roll',
    Age: 'age',
    DeathDate: 'death_date',
    CemeteryName: 'cemetery_name',
    CemeteryAddress1: 'cemetery_address1',
    CemeteryAddress2: 'cemetery_address2',
    CemeteryAddress3: 'cemetery_address3',
    CemeteryAddress4: 'cemetery_address4',
    CemeteryPostCode: 'cemetery_postcode',
    GraveSection: 'grave_section',
    GraveRow: 'grave_row',
    GraveNumber: 'grave_number',
    HeadstoneInscription: 'headstone_inscription',
  };

  static pathNames = {
    FEEDBACK: 'feedback',
    SENT: 'sent',
    ACCESSIBILITY_STATEMENT: 'accessibility-statement',
    COOKIE_POLICY: 'cookie-policy',
    DETAILS: 'details',
    RESULT: 'result',
    PRIVACY_POLICY: 'privacy-policy',
    UPDATE_DATA: ConfigService.UPDATE_DATA,
    SUCCESS: ConfigService.SUCCESS,
    CONFIRM_DATA: ConfigService.CONFIRM_DATA,
    CONFIRM_DATA_TRANSFER: `${ConfigService.CONFIRM_DATA}-${ConfigService.TRANSFER}`,
    MODLOGIN: ConfigService.MODLOGIN,
  };

  static appUrls = {
    HOME: '/',
    SEARCH_AGAIN: '/search-again',
    SERVICE: `/${ConfigService.SERVICE}`,
    DETAILS: '/details',
    FEEDBACK_SENT: `/${ConfigService.pathNames.FEEDBACK}/${ConfigService.pathNames.SENT}`,
    UPDATE_DATA: `/${ConfigService.pathNames.UPDATE_DATA}`,
    UPDATE_DATA_SUCCESS: `/${ConfigService.UPDATE_DATA}/${ConfigService.pathNames.SUCCESS}`,
    UPDATE_DATA_CONFIRM_DATA: `/${ConfigService.UPDATE_DATA}/${ConfigService.pathNames.CONFIRM_DATA}`,
    CONFIRM_DATA_TRANSFER: 'confirm-data-transfer',
    MODLOGIN: `/${ConfigService.pathNames.MODLOGIN}`,
  };

  static tableNames: Record<any, TableNames> = {
    ROLL_OF_HONOUR: 'roll_of_honour',
    ROLL_OF_HONOUR_DRY_RUN: 'roll_of_honour_dry_run',
    REVISIONS: 'revisions',
  };
}

export interface RollOfHonourRecord {
  id: string;
  pkid?: number | null;
  serial_no?: string | null;
  surname?: string | null;
  forenames?: string | null;
  decorations?: string | null;
  rank?: string | null;
  service_no?: string | null;
  regt_corps?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  service?: string | null;
  memorial?: string | null;
  nom_roll?: string | null;
  age?: string | null;
  death_date?: string | null;
  cemetery_name?: string | null;
  cemetery_address_1?: string | null;
  cemetery_address_2?: string | null;
  cemetery_address_3?: string | null;
  cemetery_address_4?: string | null;
  grave_section?: string | null;
  grave_number?: string | null;
  grave_row?: string | null;
  headstone_inscription?: string | null;
}
