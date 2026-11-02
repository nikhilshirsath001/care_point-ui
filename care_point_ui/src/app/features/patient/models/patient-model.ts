export interface PatientAddress {
  address: string;
  pincode: string;
  state: string;
  district: string;
  villageTownCity: string;
}

export interface ContactPerson {
  name: string;
  relationDescription: string;
  relationCode: string;
  relationUrl: string;
  address: string;
  mobileNumber: string;
  gender: string;
}

export interface Subscriber {
  abhaNumber: string;
  name: string;
  gender: string;
  mob: string;
  dob: string;
  subscriberId: string;
}

export interface PatientModel {
  patientId?: number;
  abhaNumber: string;
  patientName: string;
  patientDob: string;
  age: string;
  patientMob: string;
  gender: string;
  relation: string;
  patientMrNumber: string;

  isCommAddressSameAsCardAddress: boolean;
  isChildRegistration: boolean;

  patientAddress: PatientAddress;
  patientCommAddress: PatientAddress;

  contactPerson: ContactPerson;
  subscriber: Subscriber;
}