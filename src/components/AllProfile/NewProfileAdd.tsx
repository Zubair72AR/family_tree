"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { EntityDropdown } from "@/components/RelatedEntityDropdown";

import {
  addCaste,
  addEducation,
  addFamilyBranch,
  addOccupation,
  addPlaceOfBirth,
} from "@/actions/relatedEntities";
import {
  fetchCastes,
  fetchEducations,
  fetchFamilyBranches,
  fetchOccupations,
  fetchPlaces,
} from "@/lib/supabase/fetch";
import { addProfile } from "@/actions/profiles";
import { uploadPhoto } from "@/actions/upload";
import { DateInput } from "@/components/ui/calendar-input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/loading-button";
import { toast } from "sonner";
import { DuplicateMatch, ProfileWithRelatives } from "@/lib/types";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
  allProfiles: ProfileWithRelatives[];
};

export default function NewProfileAdd({ allProfiles }: Props) {
  // Basic info
  const [nameEng, setNameEng] = useState("");
  const [nameNative, setNameNative] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [dob, setDob] = useState<string | null>(null);
  // Is Alive
  const [isAlive, setIsAlive] = useState(true);
  const [dod, setDod] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Relations
  const [casteId, setCasteId] = useState<string | null>(null);
  const [educationId, setEducationId] = useState<string | null>(null);
  const [occupationId, setOccupationId] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Father, Mother, Spouse
  const [fatherId, setFatherId] = useState<string | null>(null);
  const [motherId, setMotherId] = useState<string | null>(null);
  const [spouseId, setSpouseId] = useState<string | null>(null);

  // New Profile Saving Status
  const [isSaving, setIsSaving] = useState(false);

  // TO Refresh Page Data
  const router = useRouter();

  async function handlePhotoUpload(file: File) {
    // Check file size (500 KB max)
    const maxSize = 500 * 1024; // 500 KB in bytes
    if (file && file.size > maxSize) {
      toast.warning("File Too Large", {
        description: "Please select an image under 500 KB",
      });
      return;
    }

    setPhotoFile(file);
  }

  // IMage Choose File Reset Clear
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Returns the main type of duplicate: "name", "father", "mother" or null
  function getDuplicateType(): DuplicateMatch[] {
    const nameLower = nameEng.trim().toLowerCase();

    return allProfiles
      .filter((p) => p.name_eng.toLowerCase() === nameLower)
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

  async function handleSubmit() {
    // Check Name (English)
    if (!nameEng.trim()) {
      toast.warning("Name Required", {
        description: "Please enter English name",
      });
      return;
    }

    // Check Name (Native)
    if (!nameNative.trim()) {
      toast.warning("Native Name Required", {
        description: "Please enter native name",
      });
      return;
    }

    // Check Family Branch selection
    if (!selectedBranch) {
      toast.warning("Family Branch Required", {
        description: "Select primary family branch",
      });
      return;
    }

    try {
      setIsSaving(true); // start loading

      let uploadedUrl = null; // use existing URL if any

      // ✅ Upload image here if a new file is selected
      if (photoFile) {
        uploadedUrl = await uploadPhoto(photoFile);
      }

      const newProfile = await addProfile({
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
        date_of_death: dod ? new Date(dod) : null,
        profile_photo: uploadedUrl || null, // use uploaded image
        notes: notes?.trim() || null,
      });

      router.refresh(); // Refresh Data so that new Profile can be added in the dropdown selection

      // Notification
      toast.success(`"${newProfile.name_eng}" is added successfully`, {
        description:
          "The new family member has been added to your family tree.",
        action: {
          label: "View",
          onClick: () => (window.location.href = `/people/${newProfile.id}`),
        },
      });

      // Reset form
      setNameEng("");
      setNameNative("");
      setGender("male");
      setCasteId(null);
      setEducationId(null);
      setOccupationId(null);
      setPlaceId(null);
      setSelectedBranch(null);
      setFatherId(null);
      setMotherId(null);
      setSpouseId(null);
      setDob(null);
      setDod(null);
      setNotes(null);
      setPhotoFile(null);
      // Reset the file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      toast.warning("Error Occurred", {
        description: err?.message || "Something went wrong",
      });
      console.error(err);
    } finally {
      setIsSaving(false); // stop loading
    }
  }
  // ====== Filtered options for relation inputs ======

  // Siblings: share same father or mother
  const siblingsIds = allProfiles
    .filter(
      (p) =>
        (p.father_id && fatherId && p.father_id === fatherId) ||
        (p.mother_id && motherId && p.mother_id === motherId),
    )
    .map((p) => p.id);

  // Sibling spouses: exclude these from spouse selection
  const siblingsSpouseIds = allProfiles
    .filter((p) => siblingsIds.includes(p.spouse_id ?? ""))
    .map((p) => p.id);

  // ====== Mother Options ======
  const motherOptions = allProfiles
    .filter((p) => {
      // Female only
      if (p.gender !== "female") return false;

      // Exclude self, siblings, spouse, sibling spouses
      if (siblingsIds.includes(p.id) || siblingsSpouseIds.includes(p.id))
        return false;

      // DOD check: mother must be alive at new profile's DOB
      if (p.date_of_death && dob) {
        if (new Date(p.date_of_death).getTime() < new Date(dob).getTime())
          return false;
      }

      // Optional: mother at least 12 years older
      if (p.date_of_birth && dob) {
        const ageAtBirth =
          new Date(dob).getFullYear() - new Date(p.date_of_birth).getFullYear();
        if (ageAtBirth < 12) return false;
      }

      return true;
    })
    .map((p) => ({
      id: p.id,
      name: p.name_eng,
      fatherName: p.father_name,
      gender: p.gender,
      photo: p.profile_photo,
    }));

  // ====== Spouse Options ======
  const spouseOptions = allProfiles
    .filter((p) => {
      // Opposite gender
      if (p.gender === gender) return false;

      // Exclude self, parents, siblings, sibling spouses
      if (
        p.id === fatherId ||
        p.id === motherId ||
        siblingsIds.includes(p.id) ||
        siblingsSpouseIds.includes(p.id)
      )
        return false;

      // DOD check: spouse must be alive at new profile's DOB
      if (p.date_of_death && dob) {
        if (new Date(p.date_of_death).getTime() < new Date(dob).getTime())
          return false;
      }

      return true;
    })
    .map((p) => ({
      id: p.id,
      name: p.name_eng,
      fatherName: p.father_name,
      gender: p.gender,
      photo: p.profile_photo,
    }));

  useEffect(() => {
    if (!fatherId) return;

    const father = allProfiles.find((p) => p.id === fatherId);
    if (!father) return;

    if (father.spouse_id) {
      setMotherId(father.spouse_id);
    }
  }, [fatherId]);

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
        {photoFile && (
          <Image
            src={URL.createObjectURL(photoFile)}
            alt="Profile Photo"
            width={100}
            height={100}
            className="aspect-square rounded-full object-cover"
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
          options={motherOptions}
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
          options={spouseOptions}
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
          (Select a family lineage name (grandfather, great-grandfather, or any
          suitable ancestor). This is one lineage for the whole family and can
          be edited later. All sons and their children belong to this lineage.
          Daughters belong, but their children follow their father’s lineage.
          This is used only for sharing—so you can share one lineage (e.g.,
          father’s side) without exposing the entire family tree.)
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
            Yes, Create Separate Profile
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
