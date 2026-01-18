import ContactIconInfo from "@/components/Footer/ContactIconInfo";
import { CircleSmall, Mail, PhoneCall } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQs() {
  const faqs = [
    {
      category: "Privacy & Data",
      items: [
        {
          q: "Is my family data private?",
          a: "Yes. Your family data is private by default and only visible to you unless you choose to share a specific family branch.",
        },
        {
          q: "Who can see my family tree?",
          a: "Only users you explicitly share a family branch with can view limited information based on your sharing settings.",
        },
        {
          q: "Does each profile have individual privacy control?",
          a: "Yes. When you share a specific family lineage, all other lineages and their details are automatically hidden from the shared user.",
        },
        {
          q: "Is the website multi-language?",
          a: "No. The website supports only one language interface. However, in the name field, you can enter both native language and English names.",
        },
      ],
    },
    {
      category: "Account & Access",
      items: [
        {
          q: "Can I edit my family information later?",
          a: "Yes. You can update, edit, or remove family members at any time from your account.",
        },
        {
          q: "What happens if I delete my account?",
          a: "Deleting your account permanently removes your profile and associated family tree data.",
        },
        {
          q: "Can a member's father/mother/spouse be changed after adding?",
          a: "Yes. All relationships are fully editable. You can change, remove, or update relations at any time. Note: If a wrong relation is added, the profile will appear in the wrong position until it is corrected.",
        },
        {
          q: "Are login and authentication required?",
          a: "Yes. Users must be logged in to add or manage family profiles. Without login, profiles cannot be added.",
        },
        {
          q: "Is the system free?",
          a: "The system is currently 100% free. Paid plans may be introduced in the future depending on data usage and features.",
        },
        {
          q: "Can I remove shared users?",
          a: "Yes. You can remove or delete a shared user at any time. Once removed, the shared user will no longer be able to access the website or view the family tree.",
        },
        {
          q: "Who is the admin of the family tree?",
          a: "The first logged-in user becomes the admin. Sub-users can be created with view-only or editor access, depending on the role assigned by the admin.",
        },
      ],
    },
    {
      category: "Sharing & Permissions",
      items: [
        {
          q: "Can I share only part of my family tree?",
          a: "Yes. You can share a specific lineage or branch without exposing your entire family tree.",
        },
        {
          q: "Can shared users edit my data?",
          a: "Only users with edit permission can modify data. View-only users cannot make changes.",
        },
        {
          q: "Do shared users see future updates automatically?",
          a: "When you share access, you can choose to share the full family tree or a specific family lineage. Shared users will automatically see all future updates — either for the entire tree or only for the shared lineage, depending on what you shared.",
        },
        {
          q: "Can shared (view-only) users use search and filter?",
          a: "Yes. Shared (view-only) users can also use search and filter features.",
        },
      ],
    },
    {
      category: "Family Structure & Relationships",
      items: [
        {
          q: "Can a person have multiple spouses?",
          a: "No. Currently, a person can only have one spouse in the system.",
        },
        {
          q: "Does the system auto-adjust family positions?",
          a: "Yes. When a user adds a family member, the system automatically adjusts relationships — for example, a father is automatically positioned above the children in the family tree.",
        },
        {
          q: "Can daughters’ or sons’ grandchildren be hidden?",
          a: "Yes. The tree respects lineage type: If the lineage type is father, daughters’ grandchildren are not shown. If the lineage type is mother, sons’ grandchildren are not shown.",
        },
        {
          q: "Are spouses displayed together?",
          a: "Yes. Spouses are displayed together on the same card, side by side.",
        },
        {
          q: "Can admin override accidental changes made by editors?",
          a: "Yes. If an admin grants a user editing permissions, that user can edit or delete data, just like the admin.",
        },
        {
          q: "Are father, mother, spouse assignments editable?",
          a: "Yes. Relationships can be edited, removed, or updated at any time.",
        },
      ],
    },
    {
      category: "Profiles & Fields",
      items: [
        {
          q: "Are profile photos required?",
          a: "No. Only four fields are required: name, name in native language, gender, and family tree selection. All other fields — including profile photo and additional details — are optional and depend on how much information you want to display.",
        },
        {
          q: "Can custom fields be added?",
          a: "No. Custom fields cannot be added. However, there is a single Notes field where any additional information can be entered.",
        },
      ],
    },
    {
      category: "Search & Navigation",
      items: [
        {
          q: "Does clicking a profile center the tree?",
          a: "Yes. Clicking on any profile centers the family tree on that person and highlights them with a different color. The same behavior applies when a profile is found through search — the searched member is automatically focused and highlighted.",
        },
        {
          q: "Can you search members by name?",
          a: "Yes. You can search family members by name on the family tree page. Additionally, on the all profiles page, you can search, filter, and sort members using advanced filtering options.",
        },
      ],
    },
    {
      category: "Performance & Limits",
      items: [
        {
          q: "Is there a limit on family members?",
          a: "There is no limit. You can add unlimited family members to your family tree.",
        },
        {
          q: "Does the system maintain performance for large trees?",
          a: "Yes. The system maintains smooth performance even for large family trees with 1000+ members.",
        },
        {
          q: "Is editing time or activity log shown?",
          a: "No. Editing time or activity logs are not shown. This is intentionally done to keep the website lightweight and fast, especially for large family trees with 1000+ profiles.",
        },
      ],
    },
    {
      category: "Import / Export",
      items: [
        {
          q: "Can I export or import family tree data?",
          a: "No. Currently, there is no option to download, export, or import family tree data.",
        },
      ],
    },
    {
      category: "Multi-Device Access",
      items: [
        {
          q: "Does the family tree work on all devices?",
          a: "Yes. The family tree works properly on mobile, tablet, and desktop devices.",
        },
      ],
    },
  ];

  return (
    <div className="pad-x mx-auto my-8 w-full max-w-3xl">
      <div className="mb-6 text-center">
        <h1 className="font-bodoni text-3xl">Frequently Asked Questions</h1>
        <p className="text-foreground/65 text-sm">
          Answers to common questions about using the Family Tree.
        </p>
      </div>

      {/* FAQ Sections */}
      {faqs.map((section, idx) => (
        <div key={idx}>
          {/* Category Heading */}
          <h2 className="mt-3 mb-0.5 text-xl font-bold">{section.category}</h2>

          {/* Accordion */}
          <Accordion type="single" collapsible>
            {section.items.map((item, i) => (
              <AccordionItem key={i} value={`${idx}-${i}`}>
                <AccordionTrigger className="text-foreground/65 hover:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="bg-accent/50 text-foreground/65 mb-2 text-sm">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}

      {/* Contact Info */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-12">
        <ContactIconInfo
          className=""
          text="Contact (WhatsApp)"
          head="+92 342 3873626"
          textClass="text-foreground"
          headClass="text-primary"
          iconClass="text-primary"
          circleClass="bg-primary"
          Icon={PhoneCall}
        />

        {/* Email  */}
        <ContactIconInfo
          className=""
          text="Email"
          head="hzubair717@gmail.com"
          textClass="text-foreground"
          headClass="text-primary"
          iconClass="text-primary"
          circleClass="bg-primary"
          Icon={Mail}
        />
      </div>
    </div>
  );
}
