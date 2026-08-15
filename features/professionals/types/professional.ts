export type PublicProfessionalCard = {
  id: number;
  fullName: string;
  specialty: string | null;
  languagesSpoken: string | null;
  yearsOfExperience: number | null;
  country: string | null;
  cityRegion: string | null;
  bio: string | null;
  availabilityStatus: string;
};

export type PublicProfessionalBlog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type PublicFacilityAffiliation = {
  facilityId: number;
  facilityName: string;
  facilityCity: string | null;
  facilityCountry: string;
  verificationStatus: string;
};

export type PublicProfessionalDetail = PublicProfessionalCard & {
  blogs: PublicProfessionalBlog[];
  facilities: PublicFacilityAffiliation[];
};
