// Not Found Page
export interface NotFoundProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

// Updating Profile Data Type
export type Profile = {
  id: string;
  profile_photo: string | null;
  name_eng: string;
  name_native_lang: string | null;
  gender: "male" | "female" | "other";

  caste_id: string | null;
  education_id: string | null;
  occupation_id: string | null;
  place_of_birth_id: string | null;
  lineage_id?: string | null;

  father_id?: string | null;
  mother_id?: string | null;
  spouse_id?: string | null;

  date_of_birth: Date | null;
  date_of_death: Date | null;

  notes: string | null;
  admin_id: string;
};

// Fetch Profile Data Type
export type ProfileDisplay = {
  id: string;
  profile_photo: string | null;
  name_eng: string;
  name_native_lang: string | null;
  gender: "male" | "female" | "other";

  caste_name?: string | null;
  education_degree?: string | null;
  occupation_name?: string | null;
  place_of_birth_city?: string | null;
  lineage_branch_name?: string | null;

  father_id?: string | null;
  mother_id?: string | null;
  spouse_id?: string | null;

  date_of_birth: Date | null;
  date_of_death: Date | null;
  notes: string | null;
  children_count: number;
};

// Fetch Profile with Relatives Name
export type ProfileWithRelatives = ProfileDisplay & {
  father_name?: string | null;
  mother_name?: string | null;
  spouse_name?: string | null;
};

// Filtering Data Type
export type Filters = {
  fathers: string[];
  mothers: string[];
  cities: string[];
  castes: string[];
  educations: string[];
  professions: string[];
  branches: string[];
  lifeStatus: ("alive" | "dead")[];
};

// Search Profile from NODE
export type FamilyNodeData = {
  profile: ProfileWithRelatives;
  spouseProfile?: ProfileWithRelatives | null;
  childCount: number;
  isCollapsed: boolean;
  width: number;
  focusId?: string;
};

// Duplicate Name Issue
export type DuplicateMatch = {
  profile: ProfileWithRelatives;
  match: {
    name: boolean;
    father: boolean;
    mother: boolean;
  };
};

// Family Head with Relatives
export type FamilyHeadWithRelatives = {
  profile_id: string;
  profile_photo: string | null;
  name_eng: string;
  gender: "male" | "female" | "other";
  date_of_death: string | null;
  father_name: string | null;
};

// DropDown Selecting Menu Data Type
export type DropDownProfile = {
  id: string;
  name: string;
  gender?: string;
  fatherName?: string | null;
  photo?: string | null;
};

// Family Head Drop Down
export type FamilyHeadDropDOwn = {
  id: string;
  name: string;
  gender?: string;
  date_of_birth: Date | null;
  date_of_death: Date | null;
  fatherName?: string | null;
  father_id?: string | null;
  children_count: number;
  photo: string | null;
};

// Fetch Lineage Name ID and Number od Lineage used in Profile for creating new user
export type AdminLineage = {
  lineage_id: string;
  lineage_name: string;
  total_profiles: number;
};
