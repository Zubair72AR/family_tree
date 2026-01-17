"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { EntityDropdown } from "@/components/RelatedEntityDropdown";
import { DateInput } from "@/components/ui/calendar-input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/loading-button";

import {
  fetchCastes,
  fetchEducations,
  fetchFamilyBranches,
  fetchOccupations,
  fetchPlaces,
} from "@/lib/supabase/fetch";
import {
  addCaste,
  addEducation,
  addFamilyBranch,
  addOccupation,
  addPlaceOfBirth,
} from "@/actions/relatedEntities";
import { uploadPhoto } from "@/actions/upload";
import { updateProfile } from "@/actions/updateProfile";
import { DuplicateMatch, Profile, ProfileWithRelatives } from "@/lib/types";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  allProfiles: ProfileWithRelatives[];
  ProfileEdit: any;
}

export default function EditProfileForm({ allProfiles, ProfileEdit }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nameEng, setNameEng] = useState(ProfileEdit.name_eng);
  const [nameNative, setNameNative] = useState(ProfileEdit.name_native_lang);
  const [gender, setGender] = useState(
    ProfileEdit.gender as "male" | "female" | "other",
  );
  const [dob, setDob] = useState(ProfileEdit.date_of_birth || null);
  const [dod, setDod] = useState(ProfileEdit.date_of_death || null);
  const [isAlive, setIsAlive] = useState(!ProfileEdit.date_of_death);
  const [notes, setNotes] = useState(ProfileEdit.notes || null);
  const [photoUrl, setPhotoUrl] = useState(ProfileEdit.profile_photo || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [casteId, setCasteId] = useState(ProfileEdit.caste_id || null);
  const [educationId, setEducationId] = useState(
    ProfileEdit.education_id || null,
  );
  const [occupationId, setOccupationId] = useState(
    ProfileEdit.occupation_id || null,
  );
  const [placeId, setPlaceId] = useState(ProfileEdit.place_of_birth_id || null);
  const [selectedBranch, setSelectedBranch] = useState(
    ProfileEdit.lineage_id || null,
  );
  const [fatherId, setFatherId] = useState(ProfileEdit.father_id || null);
  const [motherId, setMotherId] = useState(ProfileEdit.mother_id || null);
  const [spouseId, setSpouseId] = useState(ProfileEdit.spouse_id || null);

  const [isSaving, setIsSaving] = useState(false);

  // ===== Photo Upload =====
  const handlePhotoUpload = async (file: File) => {
    const maxSize = 500 * 1024;
    if (file && file.size > maxSize) {
      toast.warning("File Too Large", {
        description: "Select image under 500 KB",
      });
      return;
    }

    setPhotoFile(file);
    try {
      const url = await uploadPhoto(file);
      setPhotoUrl(url);
    } catch (err: any) {
      toast.error("Upload Failed", {
        description: err?.message || "Something went wrong",
      });
    }
  };

  // Returns the main type of duplicate: "name", "father", "mother" or null
  function getDuplicateType(): DuplicateMatch[] {
    const nameLower = nameEng.trim().toLowerCase();

    return allProfiles
      .filter(
        (p) =>
          p.name_eng.toLowerCase() === nameLower && p.id !== ProfileEdit.id,
      )
      .map((p) => ({
        profile: p,
        match: {
          name: true,
          father: !!fatherId && p.father_id === fatherId,
          mother: !!motherId && p.mother_id === motherId,
        },
      }));
  }

  // Usage
  const duplicates = getDuplicateType();

  // Determine the highest priority match for UI
  const duplicateMessageType = duplicates.find((d) => d.match.father)
    ? "father"
    : duplicates.find((d) => d.match.mother)
      ? "mother"
      : duplicates.length > 0
        ? "name"
        : null;

  // ===== Submit =====
  const handleSubmit = async () => {
    if (!nameEng.trim()) return toast.warning("Enter English name");
    if (!nameNative.trim()) return toast.warning("Enter native name");
    if (!selectedBranch) return toast.warning("Select family branch");

    setIsSaving(true);

    try {
      const updatedData = {
        name_eng: nameEng.trim(),
        name_native_lang: nameNative.trim(),
        gender,
        caste_id: casteId,
        education_id: educationId,
        occupation_id: occupationId,
        place_of_birth_id: placeId,
        lineage_id: selectedBranch,
        father_id: fatherId,
        mother_id: motherId,
        spouse_id: spouseId,
        date_of_birth: dob ? new Date(dob) : null,
        date_of_death: isAlive ? null : dod ? new Date(dod) : null,
        profile_photo: photoUrl || null,
        notes: notes?.trim() || null,
      };

      await updateProfile(ProfileEdit.id, updatedData);

      toast.success("Profile updated successfully", {
        description:
          "The family member's profile has been successfully updated in your family tree.",
      });

      router.push(`/people/${ProfileEdit.id}`);
    } catch (err: any) {
      toast.error("Update failed", {
        description: err?.message || "Something went wrong",
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="space-y-1.5">
        <Label>
          Name
          <span className="text-destructive font-semibold">*</span>
          <span className="text-foreground/80 text-[13px] font-light">
            (Full name in English letters)
          </span>
        </Label>
        <Input
          value={nameEng}
          placeholder="Abdullah"
          onChange={(e) => setNameEng(e.target.value)}
        />
      </div>

      {/* Name In Native Language */}
      <div className="space-y-1.5">
        <Label>
          Native
          <span className="text-destructive font-semibold">*</span>
          <span className="text-foreground/80 text-[13px] font-light">
            (Full name in local scripts, e.g., Arabic, Chinese)
          </span>
        </Label>
        <Input
          value={nameNative}
          placeholder="عبدالله, Carlos, 李伟, अब्दुल्लाह"
          onChange={(e) => setNameNative(e.target.value)}
          className="font-universal"
        />
      </div>

      {/* Profile Photo */}
      <div className="space-y-1.5">
        <Label>
          Profile Photo
          <span className="text-foreground/80 text-[13px] font-light">
            (Square image, up to 500 KB)
          </span>
        </Label>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            e.target.files && handlePhotoUpload(e.target.files[0])
          }
        />
        {photoFile && photoUrl ? (
          <Image
            src={URL.createObjectURL(photoFile)}
            alt="Profile Photo"
            width={100}
            height={100}
            className="aspect-square rounded-full border-3 border-purple-500 object-cover"
          />
        ) : (
          <Image
            src={
              ProfileEdit.profile_photo
                ? ProfileEdit.profile_photo
                : ProfileEdit.gender === "female"
                  ? "/female_profile.svg"
                  : "/male_profile.svg"
            }
            alt="Profile Photo"
            width={100}
            height={100}
            className="aspect-square rounded-full border-3 border-red-500 object-cover"
          />
        )}
      </div>

      {/* Gender Radio */}
      <div className="space-y-1.5">
        <Label>
          Gender<span className="text-destructive font-semibold">*</span>
        </Label>
        <RadioGroup
          value={gender}
          onValueChange={(val) => setGender(val as any)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-1">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male" className="text-foreground/65 font-normal">
              Male
            </Label>
          </div>
          <div className="flex items-center gap-1">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female" className="text-foreground/65 font-normal">
              Female
            </Label>
          </div>
          <div className="flex items-center gap-1">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="text-foreground/65 font-normal">
              Other
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Date of Birth */}
      <div className="space-y-1.5">
        <Label>Date of Birth</Label>
        <DateInput value={dob} onChange={setDob} />
      </div>

      {/* Is Alive Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="is-alive"
          checked={isAlive}
          onCheckedChange={(checked) => setIsAlive(Boolean(checked))}
        />
        <Label htmlFor="is-alive" className="mb-0">
          Currently Alive
          <span className="text-foreground/80 text-[13px] font-light">
            (Check if currently alive)
          </span>
        </Label>
      </div>

      {/* If Person not Alive Date of Death */}
      {!isAlive && (
        <div className="space-y-1.5">
          <Label>Date of Death</Label>
          <DateInput value={dod} onChange={setDod} />
        </div>
      )}

      {/* Father Relations */}
      <div className="space-y-1.5">
        <Label>
          Father
          <span className="text-foreground/80 text-[13px] font-light">
            (Select father from profiles)
          </span>
        </Label>
        <Combobox
          label="Father"
          value={fatherId}
          onChange={setFatherId}
          options={allProfiles
            .filter((p) => p.gender === "male")
            .map((p) => ({
              id: p.id,
              name: p.name_eng,
              fatherName: p.father_name,
              gender: p.gender,
              photo: p.profile_photo,
            }))}
        />
      </div>

      {/* Mother Relations */}
      <div className="space-y-1.5">
        <Label>
          Mother
          <span className="text-foreground/80 text-[13px] font-light">
            (Select mother from profiles)
          </span>
        </Label>
        <Combobox
          label="Mother"
          value={motherId}
          onChange={setMotherId}
          options={allProfiles
            .filter((p) => p.gender === "female")
            .map((p) => ({
              id: p.id,
              name: p.name_eng,
              fatherName: p.father_name,
              gender: p.gender,
              photo: p.profile_photo,
            }))}
        />
      </div>

      {/* Spouse Relations */}
      <div className="space-y-1.5">
        <Label>
          Spouse
          <span className="text-foreground/80 text-[13px] font-light">
            (Select spouse if married)
          </span>
        </Label>
        <Combobox
          label="Spouse"
          value={spouseId}
          onChange={setSpouseId}
          options={allProfiles
            .filter((p) =>
              gender === "male" ? p.gender === "female" : p.gender === "male",
            )
            .map((p) => ({
              id: p.id,
              name: p.name_eng,
              fatherName: p.father_name,
              gender: p.gender,
              photo: p.profile_photo,
            }))}
        />
      </div>

      {/* Caste */}
      <div className="space-y-1.5">
        <Label>
          Caste
          <span className="text-foreground/80 text-[13px] font-light">
            (Add or select caste/community)
          </span>
        </Label>
        <EntityDropdown
          label="Caste"
          fetchItems={fetchCastes}
          addItem={addCaste}
          value={casteId}
          onChange={setCasteId}
        />
      </div>

      {/* Education */}
      <div className="space-y-1.5">
        <Label>
          Education
          <span className="text-foreground/80 text-[13px] font-light">
            (Add or select highest education qualification)
          </span>
        </Label>
        <EntityDropdown
          label="Education"
          fetchItems={fetchEducations}
          addItem={addEducation}
          value={educationId}
          onChange={setEducationId}
        />
      </div>

      {/* Occupation */}
      <div className="space-y-1.5">
        <Label>
          Occupation
          <span className="text-foreground/80 text-[13px] font-light">
            (Add or select profession or job)
          </span>
        </Label>
        <EntityDropdown
          label="Occupation"
          fetchItems={fetchOccupations}
          addItem={addOccupation}
          value={occupationId}
          onChange={setOccupationId}
        />
      </div>

      {/* Place of Birth */}
      <div className="space-y-1.5">
        <Label>
          Place of Birth
          <span className="text-foreground/80 text-[13px] font-light">
            (Add or select birthplace city)
          </span>
        </Label>
        <EntityDropdown
          label="Place of Birth"
          fetchItems={fetchPlaces}
          addItem={addPlaceOfBirth}
          value={placeId}
          onChange={setPlaceId}
        />
      </div>

      {/* Family Branch */}
      <div className="space-y-1.5">
        <Label>
          Family Lineage / Branch
          <span className="text-destructive font-semibold">*</span>
        </Label>
        <p className="text-foreground/80 text-[13px] leading-tight font-light">
          (Select the primary family branch for this person. When sharing the
          family tree, only members of this branch (and their spouses, if any)
          will be visible. You can share a specific branch or all members.)
        </p>
        {/* Multi Branch Dropdown */}
        <EntityDropdown
          label="Family Branch"
          fetchItems={fetchFamilyBranches}
          addItem={addFamilyBranch}
          value={selectedBranch}
          onChange={setSelectedBranch}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label>
          Biography
          <span className="text-foreground/80 text-[13px] font-light">
            (Optional extra information about the person, e.g., Achievements,
            Biography)
          </span>
        </Label>
        <Textarea
          value={notes || ""}
          placeholder="Any additional information…"
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {duplicateMessageType && nameNative && selectedBranch ? (
        <div>
          <div className="my-3 space-y-2 rounded-lg border-2 border-red-600/25 bg-red-700/15 p-3">
            <p className="flex items-start gap-1 text-base font-semibold text-red-700">
              <TriangleAlert />
              {duplicateMessageType === "father" && (
                <span>
                  A person with the same name and father already exists.
                </span>
              )}
              {duplicateMessageType === "mother" && (
                <span>
                  A person with the same name and mother already exists.
                </span>
              )}
              {duplicateMessageType === "name" && (
                <span>A person with the same name already exists.</span>
              )}
            </p>

            {/* Render duplicates list */}
            {duplicates.map((d) => (
              <div className="flex items-center gap-2" key={d.profile.id}>
                <Image
                  src={
                    d.profile.profile_photo
                      ? d.profile.profile_photo
                      : d.profile.gender === "female"
                        ? "/female_profile.svg"
                        : "/male_profile.svg"
                  }
                  alt={`${d.profile.name_eng} Profile Photo`}
                  width={130}
                  height={130}
                  priority={false}
                  className="bg-background aspect-square rounded-full border object-cover"
                />
                <div>
                  <p className="text-xl font-semibold">{d.profile.name_eng}</p>
                  <p className="text-sm leading-tight opacity-65">
                    Father: {d.profile.father_name}
                  </p>
                  <p className="text-sm leading-tight opacity-65">
                    Mother: {d.profile.mother_name}
                  </p>
                  <Link href={`/people/${d.profile.id}`}>
                    <Button className="mt-1 h-8 px-2" variant="outline">
                      Check existing profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <LoadingButton
            loading={isSaving}
            onClick={handleSubmit}
            className="h-12 w-full"
            variant="destructive"
          >
            Save Profile Anyway
          </LoadingButton>
        </div>
      ) : (
        <LoadingButton
          loading={isSaving}
          onClick={handleSubmit}
          className="h-12 w-full"
          variant="primary"
        >
          Save Profile
        </LoadingButton>
      )}
    </div>
  );
}
