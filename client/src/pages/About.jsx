import { Users, Target, Award, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Heart,
      title: t("valueCustomerFirst"),
      description: t("valueCustomerFirstDesc"),
    },
    {
      icon: Award,
      title: t("valueQuality"),
      description: t("valueQualityDesc"),
    },
    {
      icon: Users,
      title: t("valueCommunity"),
      description: t("valueCommunityDesc"),
    },
    {
      icon: Target,
      title: t("valueInnovation"),
      description: t("valueInnovationDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            {t("aboutTitle")}
          </h1>
          <p className="text-xl text-muted-foreground">{t("aboutSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-secondary rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-secondary rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("aboutStoryTitle")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("aboutStory")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;