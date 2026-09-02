export function buildTeamStorySection(oluwabusayoPhotoAssetId: string | null) {
  return {
    _id: 'teamStorySection',
    _type: 'teamStorySection',
    eyebrow: 'Our Story',
    headlineLine1: 'THE PEOPLE BEHIND',
    headlineLine2: 'THE PURPOSE.',
    storyParagraph1:
      "Zneako started with a simple, uncomfortable fact: the UK throws away over 600,000 tonnes of tyres every year, much of it incinerated or dumped rather than reused. In 2020, an illegal tyre stockpile fire in Bradford made that risk impossible to ignore. We asked a different question: what if that waste wasn't a disposal problem, but a material waiting for a second life?",
    storyParagraph2:
      "Working with rubber-recycling researchers at the University of Bradford's Polymer Institute, we're turning end-of-life tyre rubber into durable, sustainable soles, starting with children's footwear. Every part you don't see carries the same purpose as the part you do: a genuine commitment to a better future.",
    citationLabel: 'UK Parliament, Westminster Hall debate on tyre recycling (29 Apr 2025)',
    citationUrl:
      'https://hansard.parliament.uk/commons/2025-04-29/debates/DF1C0690-5CAF-4B76-98FC-49F46D94ED16/RecyclingOfTyres',
    grantBadgeText: 'Recipient of a rapid funding grant to support prototyping',
    team: [
      {
        _key: 'oluwabusayo-idowu',
        name: 'Oluwabusayo Idowu',
        role: 'Co-Founder & Commercial Lead',
        bio: 'Leads product translation, market validation and commercial development, making sure the science becomes something families actually want.',
        ...(oluwabusayoPhotoAssetId
          ? { photo: { _type: 'image', asset: { _type: 'reference', _ref: oluwabusayoPhotoAssetId } } }
          : {}),
      },
      {
        _key: 'rob-innie',
        name: 'Dr Rob Innes',
        role: 'CTO, Polymer Institute, University of Bradford',
        bio: 'Leads the technical work on rubber compounding, processing and prototype development.',
      },
      {
        _key: 'klaus-pors',
        name: 'Professor Klaus Pors',
        role: 'Academic Co-Founder, Institute of Cancer Therapeutics',
        bio: 'Provides strategic oversight, ensuring alignment with research, innovation and commercialisation priorities.',
      },
      { _key: 'bonnie-clyde', name: 'Bonnie Clyde', role: 'Innovation Officer' },
    ],
  };
}
