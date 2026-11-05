export type Product={name_en:string;name_ar:string;description_en?:string;description_ar?:string;media_id?:string;origin?:string;specifications?:string;packaging?:string;visibility?:'published'|'hidden'};
export type Profile={
 name_en:string;name_ar:string;description_en?:string;description_ar?:string;industry?:string;classification?:string;
 country?:string;city?:string;website?:string;logo_media_id?:string;public_email?:string;public_phone?:string;public_contact_consent?:boolean;
 supported_markets?:string[];business_languages?:string[];business_capabilities?:string;export_interests?:string;
 categories:number[];products:Product[];required_products:string[];preferred_origins:string[];required_certifications:string[];meeting_interests:string[];
 requirement_states?:Record<string,string>;quantity?:number|null;capacity?:number|null;capacity_verified:boolean;unit?:string;origin?:string;procurement_criteria?:string;
 certifications:{name:string;verified:boolean;media_id?:string}[];
};
export type Category={id:number;name_en:string;name_ar:string};
