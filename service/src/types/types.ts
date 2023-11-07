import { Request } from 'express';
import { Session } from 'express-session';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export enum YesOrNo {
  YES = 'YES',
  NO = 'NO',
}

interface ErrorListItem {
  href: string;
  text: string;
}

interface IErrorItem {
  text: string;
  id: string;
}

export interface IFlash {
  errorList?: ErrorListItem[];
  oldSessionFormData?: Record<string, string>;
  errors?: IErrorItem[];
}

export interface IRequest extends Request {
  session: ISession;
  csrfToken: () => string;
}
export interface DataUpdateInfo {
  updatesSucceededText?: string | null;
  updatesFailedText?: string | null;
  invalidIDsString?: string | null;
  invalidRecordIds?: string[] | null;
  totalInvalidRecords?: number | null;
  recordsInserted?: number | null;
}

export interface SetUploadMetricsArguments {
  session: ISession;
  dataUpdateInfo: {
    recordsInserted: number;
    totalNumberOfRecords?: number;
    totalInvalidRecords: number;
    invalidRecordIds?: string[];
    shouldKeepAllRecords: boolean;
  };
}

export interface UploadOptions {
  id: string;
  name: string;
  label: {
    text: string;
  };
  hint: {
    text: string;
  };
  errorMessage: string;
}

export interface ISession extends Session {
  sessionFormAnswers?: {
    service?: string;
    firstname?: string;
    surname?: string;
    service_number?: string;
  };
  showNotification?: boolean;
  flash?: IFlash;
  dataUpdateInfo?: DataUpdateInfo | null;
  modmail?: string;
  notifyVerificationEmailId?: string;
}

export type InputFieldset = {
  legend?: {
    text?: string;
    isPageHeading?: boolean;
    classes?: string;
  };
};

export interface GovStandardInputOptions {
  classes?: string;
  label?: {
    text: string;
    classes: string;
  };
  id: string;
  name: string;
  value?: string;
  errorMessage?: {
    text: string;
  };
  hint?: {
    text: string;
  };
  autocomplete?: string;
  fieldset?: InputFieldset;
}

export type InputTypeString = 'checkboxes' | 'upload' | 'input';

interface IItem {
  value: string;
  text: string;
}

type StandardInputOptions = {
  id: string;
  name: string;
  label?: {
    text: string;
  };
  hint?: {
    text: string;
  };
  errorMessage?: string;
};

export interface CheckboxOptions {
  inputType: InputTypeString;
  inputOptions: StandardInputOptions & {
    items: IItem[];
  };
}

export type AllowedPathNames = `/service` | '/details' | '/results';

export type PathNames = Record<AllowedPathNames, number>;

export const FormKeysEnum = {
  SERVICE: 'service',
  DETAILS: 'details',
};

export enum RollOfHonourKey {
  UPDATE_DATA = 'update-data',
  KEEP_ALL = 'keep-all',
  CONFIRM_DATA = 'confirm-data',
  TRANSFER = 'transfer',
  SUCCESS = 'success',
  MODLOGIN = 'modlogin',
  PKID = 'pkid',
  ID = 'id',
  SERIAL_NO = 'serial_no',
  SURNAME = 'surname',
  FORENAMES = 'forenames',
  GENDER = 'gender',
  DECORATIONS = 'decorations',
  RANK = 'rank',
  SERVICE_NO = 'service_no',
  REGT_CORPS = 'regt_corps',
  SERVICE = 'service',
  BIRTH_DATE = 'birth_date',
  MEMORIAL = 'memorial',
  NOM_ROLL = 'nom_roll',
  AGE = 'age',
  DEATH_DATE = 'death_date',
  CEMETARY_NAME = 'cemetery_name',
  CEMETARY_ADDRESS_1 = 'cemetery_address_1',
  CEMETARY_ADDRESS_2 = 'cemetery_address_2',
  CEMETARY_ADDRESS_3 = 'cemetery_address_3',
  CEMETARY_ADDRESS_4 = 'cemetery_address_4',
  CEMETARY_POSTCODE = 'cemetery_postcode',
  GRAVE_SECTION = 'grave_section',
  GRAVE_ROW = 'grave_row',
  GRAVE_NUMBER = 'grave_number',
  HEADSTONE_INSCRIPTION = 'headstone_inscription',
}

export interface RollOfHonourRecord {
  [RollOfHonourKey.ID]: string;
  [RollOfHonourKey.PKID]?: number | null;
  [RollOfHonourKey.SERIAL_NO]?: string | null;
  [RollOfHonourKey.SURNAME]?: string | null;
  [RollOfHonourKey.FORENAMES]?: string | null;
  [RollOfHonourKey.DECORATIONS]?: string | null;
  [RollOfHonourKey.RANK]?: string | null;
  [RollOfHonourKey.SERVICE_NO]?: string | null;
  [RollOfHonourKey.REGT_CORPS]?: string | null;
  [RollOfHonourKey.BIRTH_DATE]?: string | null;
  [RollOfHonourKey.GENDER]?: string | null;
  [RollOfHonourKey.SERVICE]?: string | null;
  [RollOfHonourKey.MEMORIAL]?: string | null;
  [RollOfHonourKey.NOM_ROLL]?: string | null;
  [RollOfHonourKey.AGE]?: string | null;
  [RollOfHonourKey.DEATH_DATE]?: string | null;
  [RollOfHonourKey.CEMETARY_NAME]?: string | null;
  [RollOfHonourKey.CEMETARY_ADDRESS_1]?: string | null;
  [RollOfHonourKey.CEMETARY_ADDRESS_2]?: string | null;
  [RollOfHonourKey.CEMETARY_ADDRESS_3]?: string | null;
  [RollOfHonourKey.CEMETARY_ADDRESS_4]?: string | null;
  [RollOfHonourKey.CEMETARY_POSTCODE]?: string | null;
  [RollOfHonourKey.GRAVE_SECTION]?: string | null;
  [RollOfHonourKey.GRAVE_NUMBER]?: string | null;
  [RollOfHonourKey.HEADSTONE_INSCRIPTION]?: string | null;
}

interface PaginationLink {
  href: string;
  html: string;
}

interface Item {
  number: number;
  href: string;
  current: boolean;
}

export interface IPaginationLinksExtended {
  first?: string;
  previous?: {
    href: string;
    html: string;
  };
  next?: PaginationLink;
  last?: string;
  total?: number;
  items?: Item[];
}

interface IGovPaginationItem {
  number?: string;
  visuallyHiddenText?: string;
  href?: string;
  current?: boolean;
  ellipsis?: boolean;
  attributes?: Record<string, string>;
}

type Row = Array<
  | {
    text: string;
    html?: string;
    classes?: string;
  }
  | {
    html: string;
    classes: string;
    text?: string;
  }
>;

export type ResultsPageData = {
  meta?: IPaginationMeta;
  links?: IPaginationLinksExtended;
  total?: number;
  head?: { text: string }[];
  rows?: Row[];
  items?: IGovPaginationItem[];
};

export interface CookiePreferences {
  analytics: boolean;
  seen: boolean;
  essential: boolean;
}

export interface ILocals {
  showCookieBanner: boolean;
  hideBackLink: boolean;
  session: ISession;
  sessionFormAnswers: ISession['sessionFormAnswers'];
  csrfToken?: string;
}

export type ServicepersonSummary =
  | {
    key: {
      text: string;
    };
    value: {
      text: string | number;
      html?: string;
    };
  }
  | {
    key: {
      text: string;
    };
    value: {
      text: number;
      html?: string;
    };
  }
  | {
    key: {
      text: string;
    };
    value: {
      html: string;
      text?: string;
    };
  };

export interface FileUploadOptions {
  inputType: InputTypeString;
  inputOptions: UploadOptions | CheckboxOptions;
}
export type TableNames =
  | 'roll_of_honour_dry_run'
  | 'roll_of_honour'
  | 'revisions';
