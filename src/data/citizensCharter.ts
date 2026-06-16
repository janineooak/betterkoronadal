export interface CharterService {
  n: number; // TOC number
  title: string; // cleaned service title
  processingTime?: string;
}

export interface CharterOffice {
  office: string; // full office name
  abbr?: string; // e.g. 'CHO', 'PESO', 'OBO' if commonly abbreviated
  services: CharterService[];
}

export const CITIZENS_CHARTER_EDITION = '2026';
export const CITIZENS_CHARTER_PDF =
  'https://koronadal.gov.ph/wp-content/uploads/2026/05/CitizensCharter2026-1.pdf';
export const CITIZENS_CHARTER_SOURCE =
  'https://koronadal.gov.ph/citizens-charter/';

export const citizensCharter: CharterOffice[] = [
  {
    office: 'Office of the City Mayor',
    services: [
      {
        n: 1,
        title:
          'Securing Referral for Financial Assistance for Hospitalization and Medical Assistance',
      },
      { n: 2, title: 'Availing of Burial Assistance' },
      {
        n: 3,
        title:
          'Availing of Financial Assistance for Educational and Other Purposes',
      },
    ],
  },
  {
    office:
      'Office of the City Mayor – Business Permit, Licensing and Franchising Division',
    abbr: 'BPLD',
    services: [
      {
        n: 4,
        title:
          "Securing Amended Business/Mayor's Permit for Additional Business Line and/or Change of Business Line, Nature or Kind",
      },
      {
        n: 5,
        title:
          'Securing Amended Business Permit for Change of Business/Trade Name, Ownership and/or Business Category',
      },
      {
        n: 6,
        title:
          'Securing Amended Business Permit for Change of Location of Business',
      },
      {
        n: 7,
        title:
          "Applying for Dropping of Motorized Tricycle Operator's Permit (MTOP)",
      },
      {
        n: 8,
        title:
          "Applying for New or Renewal of Motorized Tricycle Operator's Permit (MTOP), Unit Substitution and/or Transfer of Franchise",
      },
      {
        n: 9,
        title:
          'Complying Annual Motorized Tricycle Operators Permit (MTOP) Regulatory Fees and Requirements',
      },
      {
        n: 10,
        title:
          "Securing Amended Business/Mayor's Permit through Online Business Registration",
      },
      {
        n: 11,
        title:
          "Securing Renewal of Business/Mayor's Permit through Online Registration",
      },
      {
        n: 12,
        title:
          'Requesting for Certification as to Records and/or Operation of Certain Business Entity',
      },
      {
        n: 13,
        title: "Securing for Certified Copy of Business/Mayor's Permit",
      },
      {
        n: 14,
        title:
          'Requesting for Certification as to Records and/or Operation of Certain Business Entity',
      },
      {
        n: 15,
        title: "Securing for Certified Copy of Business/Mayor's Permit",
      },
      {
        n: 16,
        title: 'Securing Documents/Data based on Available Office Records',
      },
      { n: 17, title: 'Requesting Data/Documents relative to MTOP' },
      { n: 18, title: 'Securing Approval for Retirement of Business' },
      {
        n: 19,
        title:
          "Securing Approved New or Renewal Motorized Tricycle Operator's Permit (MTOP), Unit Substitution and/or Transfer of Franchise",
      },
      {
        n: 20,
        title: "Securing Renewal of Business/Mayor's Permit – Over the Counter",
      },
      {
        n: 21,
        title:
          'Securing Duplicate Copy of Approved MTOP, Fare Matrix, Notice of Hearing and Other Related Documents',
      },
      { n: 22, title: 'Securing MTOP Certification' },
    ],
  },
  {
    office: 'Office of the Building Official',
    abbr: 'OBO',
    services: [
      {
        n: 23,
        title:
          'Securing of Building Permit for Construction (New, Renovation, Addition, Extension, Repair, Alteration)',
      },
      { n: 24, title: 'Securing of Fencing Permit' },
      { n: 25, title: 'Securing of Certificate of Occupancy' },
      {
        n: 26,
        title:
          'Issuance of Electrical Permit (Only) For Traditional Indigenous Family Dwellings',
      },
      { n: 27, title: 'Securing of Demolition Permit' },
    ],
  },
  {
    office: "City Assessor's Office",
    services: [
      {
        n: 28,
        title:
          'Securing Annotation/Cancellation of All Liens and Encumbrances on the Tax Declaration of the Real Property',
      },
      {
        n: 29,
        title:
          'Securing a Copy of Tax Declarations, No Landholdings, Total Landholdings and Other Certifications of the Real Property',
      },
      {
        n: 30,
        title: 'Securing Certificate of No Improvement of the Real Property',
      },
      { n: 31, title: 'Securing or Requesting of Cancellation of Assessment' },
      {
        n: 32,
        title:
          'Requesting for the Assessment of New Buildings, Machineries and Newly Discovered Land',
      },
      {
        n: 33,
        title:
          'Securing Tax Declaration for Transfer of Assessment, Segregation/Consolidation of Lots and Re-Assessment of Real Properties',
      },
    ],
  },
  {
    office: 'City Accounting Office',
    services: [
      {
        n: 34,
        title:
          'Requesting for Certification of Remittance – GSIS, PAG-IBIG & PHILHEALTH',
      },
      {
        n: 35,
        title:
          'Requesting Certification of No Accountability/Outstanding Cash Advance of Employees for Terminal Leave',
      },
      {
        n: 36,
        title:
          'Requesting Certification of Disbursement Vouchers for Payment of Obligations to Creditors',
      },
      {
        n: 37,
        title:
          'Requesting Certification of PHILHEALTH Contribution for Availment of Benefits due to Hospital Confinements',
      },
      {
        n: 38,
        title: 'Requesting Certification of Application for Loan of Employees',
      },
    ],
  },
  {
    office: 'City Budget Office',
    abbr: 'CBO',
    services: [
      {
        n: 39,
        title: 'Securing of Obligation Request for Financial Transactions',
      },
      { n: 40, title: 'Securing Approval of Purchase Request' },
      {
        n: 41,
        title:
          'Securing Approval of Augmentation Request and Releasing of Appropriations',
      },
    ],
  },
  {
    office: 'City Human Resource Management Office',
    abbr: 'CHRMO',
    services: [{ n: 42, title: 'Requesting for a Certificate of Employment' }],
  },
  {
    office: 'City Planning and Development Office – Zoning Division',
    abbr: 'CPDO',
    services: [
      { n: 43, title: 'Securing Zoning Certification' },
      {
        n: 44,
        title:
          'Securing Locational Clearance for Building and Other Structures',
      },
      { n: 45, title: 'Securing Locational Clearance for Business' },
      {
        n: 46,
        title:
          'Securing Locational Clearance on Application for Variance/Exception',
      },
      {
        n: 47,
        title:
          'Securing Preliminary Subdivision Development Permit under BP 220/PD 957',
      },
      { n: 48, title: 'Issuance of Development Permit under BP 220/PD 957' },
      {
        n: 49,
        title:
          'Securing Preliminary Development Permit of Memorial Park/Cemetery',
      },
      {
        n: 50,
        title: 'Issuance of Development Permit for Memorial Park/Cemetery',
      },
      { n: 51, title: 'Issuance of Alteration Permits BP 220/PD 957' },
      {
        n: 52,
        title:
          'Securing Clearance for Subdivision among Heirs/Simple Subdivision',
      },
    ],
  },
  {
    office: "City Administrator's Office",
    services: [
      { n: 53, title: "Securing of Mayor's Clearance/Certificate" },
      {
        n: 54,
        title:
          'Securing Special Permit for Advertising and Promotional Activities',
      },
    ],
  },
  {
    office: 'Office of the City Mayor – Bids and Awards Committee',
    abbr: 'BAC',
    services: [
      {
        n: 55,
        title:
          'Participating in a Public Bidding for Goods, Services and Infrastructure Projects',
      },
    ],
  },
  {
    office: 'City General Services Office',
    abbr: 'CGSO',
    services: [
      {
        n: 56,
        title:
          'Participating in a Public Auction of Unserviceable Property, Plant and Equipment (PPE)',
      },
      {
        n: 57,
        title:
          'Availing the Use of Vehicles, Chairs, Rostrum, City Seal, Sound System and Other Equipment',
      },
    ],
  },
  {
    office: 'City Civil Registry Office',
    abbr: 'CCRO',
    services: [
      { n: 58, title: 'Applying for Marriage License' },
      { n: 59, title: 'Applying for Reconstruction of Marriage Certificate' },
      {
        n: 60,
        title:
          'Registering Civil Registry Documents (Birth Certificate, Marriage Certificate and Death/Fetal Death Certificate)',
      },
      { n: 61, title: 'Securing of Civil Registry Documents' },
      {
        n: 62,
        title:
          'Applying for Petition for Correction of Clerical Error (Birth/Marriage/Death) and Change of First Name',
      },
      {
        n: 63,
        title:
          'Applying for Legitimation (RA 9858) (Legitimation by Subsequent Marriage)',
      },
      { n: 64, title: 'Registering Court Decree (Civil Registry Law)' },
      {
        n: 65,
        title:
          'Applying for Affidavit to Use the Surname of the Father (AUSF) (RA 9255)',
      },
      { n: 66, title: 'Applying for Supplemental Report (Civil Registry Law)' },
    ],
  },
  {
    office: 'City Population Office',
    services: [
      {
        n: 67,
        title:
          'Availing Pre-Marriage Orientation Counseling/Pre-Marriage Counseling Services',
      },
      {
        n: 68,
        title:
          'Availing Responsible Parenthood/Family Planning, Adolescent Health and Youth Development, Gender and Development Trainings and Seminars',
      },
      {
        n: 69,
        title:
          'Availing of Technical Assistance on Gender & Development (GAD) and Population and Development (POPDEV) Integration',
      },
      { n: 70, title: 'Availing Family Planning Counseling' },
    ],
  },
  {
    office: 'City Nutrition Office',
    services: [
      {
        n: 71,
        title: 'Availing for Child Weighing/Supplemental Feeding Services',
      },
      { n: 72, title: 'Availing Nutrition Education Services' },
    ],
  },
  {
    office: 'Public Employment Service Office',
    abbr: 'PESO',
    services: [
      { n: 73, title: 'Availing of Local Employment Referral' },
      {
        n: 74,
        title:
          'Availing Assistance in the Conduct of Special Recruitment Activity (SRA) For Overseas Employment (Land-Based or Sea-Based)',
      },
      {
        n: 75,
        title:
          'Availing Assistance in the Conduct of Local Recruitment Activity (LRA) – For Local Employment',
      },
      {
        n: 76,
        title:
          'Availing the Special Program for the Employment of Student (SPES)',
      },
      {
        n: 77,
        title:
          "Availing Assistance in the Registration of Workers' Association (RWA)",
      },
      {
        n: 78,
        title:
          'Availing Assistance in the Filing of OFW Welfare-Related Complaints',
      },
      {
        n: 79,
        title: 'Securing Referral for Manpower Skills Training Programs',
      },
      {
        n: 80,
        title:
          'Securing Referral for DOLE Integrated Livelihood Program as Accredited Co-Partner (ACP)',
      },
      {
        n: 81,
        title:
          'Availing Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers (TUPAD) Program',
      },
      { n: 82, title: 'Availing Pangkabuhayan Financial Assistance Program' },
    ],
  },
  {
    office: 'Office of the City Mayor – Franchising Section',
    services: [
      {
        n: 84,
        title:
          'Complying Annual Motorized Tricycle Operators Permit (MTOP) Regulatory Fees and Requirements',
      },
      {
        n: 85,
        title:
          'Securing Duplicate Copies of Approved MTOP, Fare Matrix, Notice of Hearing and Other Related Documents',
      },
      {
        n: 86,
        title:
          "Securing Motorized Tricycle Operator's Permit (MTOP) Certification",
      },
      { n: 87, title: 'Requesting Data relative to the MTOP' },
      {
        n: 88,
        title:
          "Applying for Dropping of Motorized Tricycle Operator's Permit (MTOP)",
      },
    ],
  },
  {
    office: 'City Information Office',
    abbr: 'CIO',
    services: [
      { n: 89, title: 'Request for News and Information Dissemination' },
    ],
  },
  {
    office: 'City of Koronadal Library',
    services: [
      { n: 90, title: 'Borrowing of Library Materials' },
      { n: 91, title: 'Availing of Internet Services' },
    ],
  },
  {
    office: 'City Cooperatives Office',
    services: [
      {
        n: 92,
        title: 'Availing of Cooperative Loan Assistance Program (CLAP)',
      },
      { n: 93, title: 'Availing of Cooperative Trainings/Seminars' },
      {
        n: 94,
        title: 'Availing for Technical Assistance for COOP Registration',
      },
      {
        n: 95,
        title:
          'Securing Cooperative Endorsement Letter for Certificate of Compliance and Certification',
      },
      {
        n: 96,
        title:
          'Requesting for Technical Assistance for Cooperative Mandatory Reports',
      },
    ],
  },
  {
    office: 'City Agriculture Office',
    services: [
      { n: 97, title: 'Availing of Nursery Seedlings' },
      { n: 98, title: 'Availing of Trichoderma, Metarhizium and Trichogramma' },
      { n: 99, title: 'Availing of Soil Analysis' },
      { n: 100, title: 'Availing of Training Center Facilities' },
      { n: 101, title: 'Availing of Agricultural-Fishery Inputs' },
      {
        n: 102,
        title:
          'Registry System for Basic Sector in Agriculture (RSBSA) Enrollment',
      },
      { n: 103, title: 'RSBSA Enrollment' },
      { n: 104, title: 'Availing of Crop Insurance' },
      { n: 105, title: 'Availing of Certification' },
      {
        n: 106,
        title:
          'Availing of Agricultural-Fishery Training and Extension Services',
      },
    ],
  },
  {
    office: 'City Veterinary Office',
    services: [
      { n: 107, title: 'Availing of Medical Services for Small Animals' },
      { n: 108, title: 'Availing of Animal Medical Services at Home' },
      {
        n: 109,
        title: 'Availing of Shipping Permit/Veterinary Health Certificate',
      },
    ],
  },
  {
    office: 'City Environment and Natural Resources Office',
    abbr: 'CENRO',
    services: [
      { n: 110, title: 'Availing Environment Related Training/IEC' },
      { n: 111, title: 'Availing Compost (Organic)' },
      {
        n: 112,
        title:
          'Securing Certification (for Transport and Cutting of Forest Products)',
      },
      {
        n: 113,
        title:
          'Request for Release of Deposited Items (Collateral for Violation/s Committed)',
      },
      {
        n: 114,
        title:
          'Responding to Complaints over the Commission of Environment Related Offenses',
      },
      {
        n: 115,
        title: 'Securing Certification for Chainsaw Registration with DENR',
      },
      { n: 116, title: 'Securing Certification of Quarry Permits' },
      {
        n: 117,
        title:
          'Availing of Specialized Collection of Household and Business-Generated Waste after Payment of Environmental Fee',
      },
    ],
  },
  {
    office: 'City Health Office',
    abbr: 'CHO',
    services: [
      { n: 118, title: 'Availing Medical Consultation and Referral Services' },
      { n: 119, title: 'Availing Dental Services' },
      { n: 120, title: 'Availing Medico-Legal Services' },
      { n: 121, title: 'Availing Post-Mortem External Examination' },
      { n: 122, title: 'Availing Immunization Services' },
      { n: 123, title: 'Availing Ambulance Services' },
      {
        n: 124,
        title:
          'Availing of Losartan/Amlodipine and Other Related Services for Hypertension Maintenance',
      },
      {
        n: 125,
        title:
          'Availing of Community-Based Rehabilitation Program for PWUDs and RDDs',
      },
      { n: 126, title: 'Securing Health Card' },
      { n: 127, title: 'Securing a Medical Certificate' },
      { n: 128, title: 'Securing Sanitary Permit to Operate' },
      {
        n: 129,
        title: 'Availing of Metformin for Diabetes Maintenance Medication',
      },
      { n: 130, title: 'Availing Sexually Transmitted Infection Treatment' },
      { n: 131, title: 'Availing Family Planning Services' },
      { n: 132, title: 'Availing Leprosy Medication and Treatment Services' },
      { n: 133, title: 'Availing Rapid TB Diagnostic Test Using GeneXpert' },
      { n: 134, title: 'Availing for Schistosomiasis Treatment' },
      { n: 135, title: 'Availing Complete Blood Count Services' },
      {
        n: 136,
        title: 'Availing Laboratory Services (Urinalysis and Pregnancy Tests)',
      },
      {
        n: 137,
        title:
          'Availing Direct Fecal Smear and Kato-Katz Services Technique for Stool Specimen',
      },
      { n: 138, title: 'Availing Gram Staining Services' },
      { n: 139, title: 'Availing Sputum Microscopy Services' },
      { n: 140, title: 'Availing Pre-Natal Services' },
      { n: 141, title: 'Availing Post-Partum Services' },
      { n: 142, title: 'Availing Animal Bite Services' },
      { n: 143, title: 'Availing Nursing Services' },
      { n: 144, title: 'Availing Normal Birth Delivery Services' },
      { n: 145, title: 'Filing Complaints against Unsanitary Practices' },
      { n: 146, title: 'Availing Treatment for Drug Susceptible Tuberculosis' },
      { n: 147, title: 'Availing Tuberculin Skin Testing' },
      { n: 148, title: 'Availing Food Handlers Classes' },
      {
        n: 149,
        title:
          'Availing Water Examination and Water Source Disinfection/Treatment',
      },
      { n: 150, title: 'Request for Epidemiological Investigation' },
      { n: 151, title: 'Availing Treatment for Drug Susceptible Tuberculosis' },
      {
        n: 152,
        title:
          'Availing Assistance in the Filing of Complaints against Unsanitary Practices',
      },
      {
        n: 153,
        title:
          'Availing Water Examination and Water Source Disinfection/Treatment',
      },
      { n: 154, title: 'Securing Permit for the Transfer of Cadaver' },
      { n: 155, title: 'Securing Permit to Exhume Cadaver' },
      { n: 156, title: 'Availing Fogging/Fumigation Services' },
      { n: 157, title: 'Availing Food Handlers Classes' },
      { n: 158, title: 'Availing Pest Control Services' },
    ],
  },
  {
    office: 'City Social Welfare and Development Office',
    abbr: 'CSWDO',
    services: [
      {
        n: 159,
        title:
          'Availing Services for Socially Disadvantaged Women and Their Children',
      },
      {
        n: 160,
        title: 'Availing of Mediation Service for Child Support and Custody',
      },
      {
        n: 161,
        title:
          'Availing Special Protection for Children Who Are Victims of Different Forms of Abuses',
      },
      { n: 162, title: 'Availing Senior Citizens Affair Services' },
      {
        n: 163,
        title:
          'Availing Benefits from City, Province and DSWD Region XII for Senior Citizen',
      },
      {
        n: 164,
        title:
          'Applying for Persons with Disabilities Identification Card (ID)',
      },
      {
        n: 165,
        title:
          'Availing Temporary Care and Custody, Intensive Rehabilitation for Children In Conflict With the Law (CICL)',
      },
      { n: 166, title: 'Applying for Solo Parents Identification Card (ID)' },
      { n: 167, title: 'Availing Financial and Medical Assistance' },
      {
        n: 168,
        title: 'Availing Comprehensive Social Case Study Report/Case Summary',
      },
      { n: 169, title: 'Request for Certificate of Indigency' },
      { n: 170, title: 'Availing Food for Work Assistance' },
      { n: 171, title: 'Availing Cash for Work Assistance' },
      { n: 172, title: 'Availing Emergency Assistance' },
    ],
  },
  {
    office: 'City Engineering Office',
    services: [
      { n: 173, title: 'Requesting for a Joint Inspection' },
      { n: 174, title: 'Requesting for Engineering Survey' },
      {
        n: 175,
        title:
          'Requesting for 15% Advance Payment of Infra Projects under Contract',
      },
      {
        n: 176,
        title:
          'Requesting for Payment of Infra Projects under Contract (Progress or Final Billing)',
      },
      {
        n: 177,
        title:
          'Requesting for Release of Retention Money of Infra Projects under Contract',
      },
      {
        n: 178,
        title:
          'Requesting for Repair and Maintenance of Infrastructures & Utilities',
      },
      { n: 179, title: 'Requesting for Clearing of Road Right of Way (ROW)' },
    ],
  },
  {
    office: 'Office of the City Mayor – Barangay Development Program',
    services: [
      { n: 180, title: 'Requesting for Preparation of POW for Infra Projects' },
      {
        n: 181,
        title:
          'Requesting of Infrastructure Projects for School and Barangay Development',
      },
    ],
  },
  {
    office: 'City of Koronadal Investment and Promotions Center',
    abbr: 'CKIPC',
    services: [
      {
        n: 182,
        title:
          'Availing of Investment Incentives for Identified Investment Priority Areas',
      },
      { n: 183, title: 'Securing BMBE Certificate of Authority' },
    ],
  },
  {
    office: 'City Economic Enterprise Development Office',
    abbr: 'CEEDO',
    services: [
      {
        n: 184,
        title:
          'Applying for Lease of New Tomb and Re-opening of Tomb for New Burials and/or Transfer of Remains to Another Cemetery',
      },
      { n: 185, title: 'Paying for Renewal of Contract of Lease' },
      { n: 186, title: 'Renewal of Contract of Lease' },
      { n: 187, title: 'Paying of Monthly Stall Rental Fee' },
      {
        n: 188,
        title: 'Paying of Market Fee for Entry of Goods and Commodities',
      },
      { n: 189, title: 'Paying of Public Toilets and Washing Facilities Fees' },
      { n: 190, title: 'Slaughtering of Livestock' },
      {
        n: 191,
        title: 'Registering of Public Utility Vehicle in the City Terminal',
      },
      { n: 192, title: 'Paying of Terminal Fees' },
    ],
  },
  {
    office: 'City Disaster Risk Reduction and Management Office',
    abbr: 'CDRRMO',
    services: [
      {
        n: 193,
        title:
          'Availing of Assistance for Medical Emergencies and General Emergencies',
      },
      {
        n: 194,
        title:
          'Availing Assistance for Viewing of a CCTV Footage Concerning an Incident',
      },
      {
        n: 195,
        title:
          'Availing Disaster Risk Reduction Capacity Building Seminar, Training or Drill',
      },
      {
        n: 196,
        title:
          'Securing DRRM Related Plans and Data, and Rainfall Data from Weather Stations or Rain Gauges',
      },
      {
        n: 197,
        title:
          'Availing Financial Assistance for Families or Individuals, Crops and Agricultural Products and Livestock Affected by Disasters',
      },
      { n: 198, title: 'Securing Certification for Flood Prone Areas' },
    ],
  },
  {
    office: 'City Traffic Management Office',
    services: [
      { n: 199, title: 'Request for Traffic Assistance' },
      { n: 200, title: 'Filing of Complaints' },
      {
        n: 201,
        title:
          'Request for the Conduct of Orientation Seminar on Traffic Rules and Regulations',
      },
    ],
  },
  {
    office: "City Treasurer's Office",
    services: [
      { n: 202, title: 'Paying Business Tax Services' },
      { n: 203, title: 'Paying Real Property Tax Services' },
      {
        n: 204,
        title: 'Securing Business and Real Property Tax Clearance Services',
      },
      { n: 205, title: 'Paying Transfer Tax Services' },
      { n: 206, title: 'Paying Situs Tax Services' },
      {
        n: 207,
        title:
          'Paying Annual Tax for Sealing and Licensing of Weight and Measure Services',
      },
      {
        n: 208,
        title: 'Paying Idle Land and Commercial/Industrial Taxes Services',
      },
      { n: 209, title: 'Paying Other Taxes, Fees and Charges Services' },
    ],
  },
  {
    office: 'Sangguniang Panlungsod Office',
    abbr: 'SPO',
    services: [
      { n: 210, title: 'Applying for Accreditation' },
      { n: 211, title: 'Filing Administrative Complaint' },
      {
        n: 212,
        title: 'Securing Certified Machine Copy of Legislative Documents',
      },
    ],
  },
  {
    office: 'City Tourism and Cultural Affairs Office',
    services: [
      { n: 213, title: 'Securing LGU Supported Local Talents and Performers' },
      { n: 214, title: 'Accessing Tourism Reports and Relevant Data' },
    ],
  },
];
