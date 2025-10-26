# Comprehensive Guidelines for Handling Sensitive Content on Websites (YMYL / High-Stakes Topics)

## I. Purpose and Scope

Sensitive content includes information that can affect users' finances, careers, education, immigration status, or legal rights. Examples include funding amounts, salary figures, career guidance, and immigration or visa information. These guidelines align with Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) and YMYL (Your Money or Your Life) principles, as well as Bing's Content Quality criteria.

---

## II. Core Principles

1. **Accuracy** – Data must be verified, sourced, and timestamped.
2. **Transparency** – State the purpose of the content and any limitations.
3. **Accountability** – Attribute authorship, expertise, and review processes.
4. **Experience** – Demonstrate first-hand knowledge and original research.
5. **Trust** – Ensure clarity, safety, and accessibility for all users.

---

## III. Detailed Implementation Guidelines

### A. Purpose and Scope Statement

**Why it matters:**
Google raters look for clarity of purpose, especially for YMYL content. Pages without a clear purpose score poorly.

**How to implement:**
- At the top of the page, include a plain-language summary:
  ```
  "This page summarizes current funding data and career information for graduate students.
   It is for informational and educational purposes only and should not be used as financial
   or legal advice."
  ```
- State the intended audience and data scope.
- Avoid misleading titles that imply guarantees or official status.

**Example:**
```html
<section class="purpose-statement" role="complementary">
  <h2>About This Guide</h2>
  <p>This page provides an overview of graduate funding structures in Spanish linguistics programs across U.S. universities. Information is compiled from publicly available sources and is intended for educational purposes to help prospective students ask informed questions. This is not financial, legal, or career counseling.</p>
  <p><strong>Audience:</strong> Prospective graduate students, current students, academic advisors</p>
  <p><strong>Scope:</strong> U.S. doctoral programs in Spanish linguistics, data current as of Fall 2025</p>
</section>
```

---

### B. Demonstrate First-Hand Experience (E-E-A-T Enhancement)

**Why it matters:**
Experience now carries distinct weight in Google's E-E-A-T framework. Users and search engines value content produced by those with lived expertise.

**How to implement:**

**1. Author Bio with Credentials and Lived Experience:**
```html
<section class="author-bio" itemscope itemtype="https://schema.org/Person">
  <img src="/authors/jane-doe.jpg" alt="Dr. Jane Doe" itemprop="image">
  <h3 itemprop="name">Dr. Jane Doe</h3>
  <p itemprop="jobTitle">Director of Graduate Studies, State University</p>
  <p itemprop="description">Dr. Doe is a tenured professor of Spanish Linguistics and has served as Director of Graduate Studies since 2018, advising over 100 PhD students on funding packages, program selection, and career development. She holds a PhD in Hispanic Linguistics from UC Berkeley (2010) and has published extensively on graduate education in Spanish studies.</p>
</section>
```

**2. Case Studies or Quotes (Anonymized):**
```html
<aside class="case-study">
  <h4>Real Example</h4>
  <p>"A PhD student in our program (2024) secured an external NSF dissertation grant to supplement their final year of funding, extending their funding package from 5 to 6 years. This allowed them to complete archival research in Spain."</p>
  <p><em>— Anonymized case from State University Graduate Program</em></p>
</aside>
```

**3. Original Research:**
```html
<section class="original-research">
  <h3>Our 2024 Graduate Funding Survey</h3>
  <p>Based on our survey of 150 Spanish linguistics PhD students across 40 U.S. programs conducted in Spring 2024:</p>
  <ul>
    <li>67% reported stipend changes or adjustments after Year 4</li>
    <li>82% received full tuition remission for 5+ years</li>
    <li>45% supplemented funding with external fellowships</li>
  </ul>
  <p><a href="/research/2024-funding-survey-methodology.html">View survey methodology and full results</a></p>
</section>
```

**4. Reviewer Credentials:**
```html
<section class="review-info">
  <p><strong>Reviewed by:</strong> Dr. John Smith, Associate Dean for Graduate Affairs, Major University. Dr. Smith oversees funding administration for 500+ graduate students and has 15 years of experience in graduate financial aid policy.</p>
  <p><strong>Last Reviewed:</strong> October 25, 2025</p>
</section>
```

---

### C. Accuracy, Sources, and Attribution

**Why it matters:**
Outdated or unsourced content damages credibility and may reduce ranking.

**How to implement:**

**1. Always link to primary or official sources:**
```html
<p>According to <a href="https://grad.columbia.edu/funding/policies" rel="noopener">Columbia University's Graduate School funding policies</a>, PhD students in humanities receive a minimum stipend of $35,000 for 5 years (as of 2025-2026).</p>
```

**2. Clearly mark temporal scope:**
```html
<p>Stipend data reflects <strong>2025-2026 academic year</strong> figures. Amounts may change annually.</p>

<table>
  <caption>PhD Stipend Comparison (AY 2025-2026)</caption>
  <thead>
    <tr>
      <th>University</th>
      <th>Annual Stipend</th>
      <th>Source</th>
      <th>Verified Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Columbia University</td>
      <td>$35,000</td>
      <td><a href="https://grad.columbia.edu/funding">Official Site</a></td>
      <td>Oct 2025</td>
    </tr>
  </tbody>
</table>
```

**3. Avoid vague claims without data:**
```html
<!-- ❌ BAD -->
<p>Most programs offer competitive funding.</p>

<!-- ✅ GOOD -->
<p>In our 2024 survey of 40 U.S. programs, 78% (31 programs) offered 5-year guaranteed funding packages. <a href="/research/funding-survey-2024.html">View survey details</a>.</p>
```

---

### D. Disclaimers and Risk Mitigation

**Why it matters:**
For YMYL topics, disclaimers signal awareness of potential risk and protect users.

**How to implement:**

**Financial/Funding Content:**
```html
<aside class="disclaimer disclaimer--financial" role="complementary">
  <h3>Financial Information Disclaimer</h3>
  <p><strong>Purpose:</strong> This content is provided for informational and educational purposes only. It does not constitute financial advice or guarantees.</p>

  <p><strong>Accuracy:</strong> Funding amounts, stipend levels, and tuition information are compiled from publicly available sources and reflect data current as of the dates indicated. These figures may change at any time. Always verify current funding details directly with universities before making decisions.</p>

  <p><strong>Individual Circumstances:</strong> Financial aid packages vary based on individual circumstances, program policies, and availability. This information represents general trends and should not be relied upon for personal financial planning.</p>

  <p><strong>Professional Advice:</strong> For personalized financial guidance, consult a qualified financial advisor or the specific university's financial aid office.</p>

  <p><strong>Last Reviewed:</strong> 2025-10-25</p>
</aside>
```

**Immigration/Visa Content:**
```html
<aside class="disclaimer disclaimer--legal" role="complementary">
  <h3>Immigration and Legal Disclaimer</h3>
  <p><strong>Not Legal Advice:</strong> This content is for informational purposes only and does not constitute legal or immigration advice. Immigration laws, visa policies, and work authorization rules change frequently and vary by individual circumstances.</p>

  <p><strong>Jurisdictional Scope:</strong> Information applies to the United States only and is current as of the date indicated. International students should verify requirements for their specific situation and country of origin.</p>

  <p><strong>Professional Consultation Required:</strong> For personalized immigration guidance, consult a qualified immigration attorney licensed to practice in the United States. Many universities offer free consultations through their international student offices.</p>

  <p><strong>Official Sources:</strong> Always verify immigration requirements directly with <a href="https://www.uscis.gov" rel="noopener">USCIS</a>, your university's international student office, or a licensed attorney.</p>

  <p><strong>Last Reviewed:</strong> 2025-10-25</p>
</aside>
```

**Career/Job Market Content:**
```html
<aside class="disclaimer disclaimer--career" role="complementary">
  <h3>Career Information Disclaimer</h3>
  <p><strong>General Information Only:</strong> Job market information and career advice provided on this page are based on general trends, historical data, and aggregate statistics. This is not professional career counseling.</p>

  <p><strong>No Guarantees:</strong> Individual employment outcomes vary significantly based on specialization, geographic location, market conditions, individual qualifications, and many other factors. Past trends do not guarantee future results.</p>

  <p><strong>Data Sources:</strong> Career data is compiled from publicly available sources including the Modern Language Association (MLA), academic job wikis, and surveys. See citations for specific data points.</p>

  <p><strong>Professional Guidance:</strong> For personalized career counseling, consult your university's career services office, academic advisors, or professional career counselors specializing in academic careers.</p>

  <p><strong>Last Reviewed:</strong> 2025-10-25</p>
</aside>
```

**Rankings/Comparisons Content:**
```html
<aside class="disclaimer disclaimer--rankings" role="complementary">
  <h3>Ranking Methodology Disclaimer</h3>
  <p><strong>Subjectivity:</strong> Program rankings discussed on this page are inherently subjective, methodology-dependent, and change over time. No ranking system can account for individual fit, research interests, faculty mentorship quality, or personal goals.</p>

  <p><strong>Methodology Limitations:</strong> Rankings may not consider factors critical to your success, such as advisor availability, program culture, geographic location, or specific research resources. Methodology flaws and biases are discussed in detail throughout the article.</p>

  <p><strong>Use as One Factor:</strong> Rankings should be used as one of many factors in your graduate program decision, not as the sole or primary criterion. Focus on program fit, research alignment, and advisor compatibility.</p>

  <p><strong>Source Attribution:</strong> All ranking data is properly cited. See references for methodology details and limitations.</p>

  <p><strong>Last Reviewed:</strong> 2025-10-25</p>
</aside>
```

**Positive Framing Example:**
```html
<section class="content-purpose">
  <h2>How to Use This Information</h2>
  <p><strong>Our goal</strong> is to organize and explain publicly available data to help you ask better questions when researching graduate programs. We aim to provide context and perspective that complements official university information.</p>

  <p><strong>What we provide:</strong></p>
  <ul>
    <li>Compiled data from official sources with citations</li>
    <li>Analysis based on experience advising graduate students</li>
    <li>Context to help you evaluate programs</li>
    <li>Questions to ask during program visits</li>
  </ul>

  <p><strong>What we don't provide:</strong></p>
  <ul>
    <li>Personalized advice for your specific situation</li>
    <li>Guarantees about outcomes or decisions</li>
    <li>Legal, financial, or immigration counseling</li>
  </ul>

  <p><strong>Next steps:</strong> Use this information to inform conversations with program directors, current students, academic advisors, and licensed professionals (attorneys, financial advisors) as appropriate for your situation.</p>
</section>
```

---

### E. Freshness, Review Date, and Content Lifecycle

**Why it matters:**
Google and Bing prioritize recent and verifiable content for YMYL topics.

**How to implement:**

**1. Include timestamps in both HTML and metadata:**
```html
<article>
  <header>
    <h1>Graduate Funding in Spanish Linguistics Programs</h1>
    <div class="article-meta">
      <p><strong>Published:</strong> <time datetime="2024-09-15">September 15, 2024</time></p>
      <p><strong>Last Updated:</strong> <time datetime="2025-10-25">October 25, 2025</time></p>
      <p><strong>Last Reviewed:</strong> <time datetime="2025-10-25">October 25, 2025</time></p>
      <p><strong>Data Currency:</strong> AY 2025-2026</p>
    </div>
  </header>
  <!-- content -->
</article>
```

**2. JSON metadata:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Graduate Funding in Spanish Linguistics Programs",
  "datePublished": "2024-09-15",
  "dateModified": "2025-10-25",
  "lastReviewed": "2025-10-25",
  "sensitivityLevel": "high",
  "contentWarnings": ["funding-amounts", "career-advice", "financial-planning"],
  "disclaimer": "Informational purposes only. Not legal, financial, or career advice.",
  "reviewCycle": "6-months",
  "nextReviewDue": "2026-04-25"
}
```

**3. Set up content review cycle:**
```html
<section class="content-maintenance">
  <h3>Content Review Policy</h3>
  <p>This page is reviewed every <strong>6 months</strong> to ensure accuracy and currency of funding data. Next scheduled review: <strong>April 2026</strong>.</p>
  <p>Between reviews, we monitor for major changes in university policies. If you notice outdated information, please <a href="/contact">contact us</a>.</p>
</section>
```

**4. Mark historical data clearly:**
```html
<section class="historical-data">
  <h3>Historical Funding Trends (2020-2024)</h3>
  <p class="data-note"><strong>Note:</strong> This section reflects historical conditions and should not be used to predict current or future funding levels. See current data section for 2025-2026 figures.</p>
  <!-- historical charts/tables -->
</section>
```

---

### F. Public Changelog and Feedback Loop

**Why it matters:**
Transparency about updates builds credibility and user trust.

**How to implement:**

**1. Changelog section at bottom of page:**
```html
<section class="changelog">
  <h2>Update History</h2>
  <dl>
    <dt>October 2025</dt>
    <dd>
      <ul>
        <li>Updated stipend data for Columbia University and University of Chicago (AY 2025-2026)</li>
        <li>Clarified tax implications for stipend income (added IRS Publication 970 citation)</li>
        <li>Added case study: NSF dissertation grant supplementation</li>
      </ul>
    </dd>

    <dt>September 2025</dt>
    <dd>
      <ul>
        <li>Annual review completed: verified all funding data current</li>
        <li>Updated MLA job market statistics (2024 data)</li>
        <li>Added new section on external fellowship opportunities</li>
      </ul>
    </dd>

    <dt>April 2025</dt>
    <dd>
      <ul>
        <li>Mid-year review: no major changes to funding structures</li>
        <li>Added FAQ: "What happens if my funding package changes?"</li>
      </ul>
    </dd>
  </dl>
</section>
```

**2. Feedback link:**
```html
<section class="feedback">
  <h3>Help Us Keep Information Current</h3>
  <p>Graduate funding and program details change frequently. If you notice:</p>
  <ul>
    <li>Outdated stipend amounts or funding data</li>
    <li>Broken links to official sources</li>
    <li>Important missing information</li>
    <li>Errors or inaccuracies</li>
  </ul>
  <p><a href="/contact?subject=Funding%20Page%20Feedback" class="btn-primary">Report an Issue</a> or <a href="mailto:feedback@spanishacademic.com">email us directly</a>.</p>
  <p>We review all feedback and aim to update pages within 48 hours of receiving verified corrections.</p>
</section>
```

**3. "How We Keep Data Current" explainer page:**
```html
<!-- /about/data-maintenance.html -->
<article>
  <h1>How We Maintain Data Accuracy</h1>

  <section>
    <h2>Review Schedule</h2>
    <p>All pages containing funding data, career statistics, or immigration information are reviewed on a 6-month cycle:</p>
    <ul>
      <li><strong>Full Review (Semi-annual):</strong> Complete verification of all data points, sources, and citations</li>
      <li><strong>Mid-Cycle Check (Quarterly):</strong> Spot-check high-impact data (stipend amounts, major policy changes)</li>
      <li><strong>Continuous Monitoring:</strong> Subscribe to university announcements and policy updates</li>
    </ul>
  </section>

  <section>
    <h2>Verification Process</h2>
    <ol>
      <li><strong>Source Check:</strong> Verify each data point against current official university sources</li>
      <li><strong>Cross-Reference:</strong> Compare with peer institutions and historical trends</li>
      <li><strong>Expert Review:</strong> Subject matter expert reviews changes for context and accuracy</li>
      <li><strong>Update:</strong> Make changes with clear changelog entries</li>
      <li><strong>Document:</strong> Update lastReviewed timestamps and metadata</li>
    </ol>
  </section>

  <section>
    <h2>User Contributions</h2>
    <p>We welcome feedback from current students, faculty, and administrators. Reported issues are:</p>
    <ul>
      <li>Reviewed within 24 hours</li>
      <li>Verified against official sources</li>
      <li>Updated within 48 hours if confirmed</li>
      <li>Acknowledged via email to reporter</li>
    </ul>
  </section>
</article>
```

---

### G. Structured Data and Schema Usage

**Why it matters:**
Structured data helps search engines correctly interpret content and improves ranking signals.

**How to implement:**

**1. Article with Author and Reviewer:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose a Graduate Program in Spanish - Funding and Career Considerations",
  "description": "Comprehensive guide to evaluating Spanish linguistics graduate programs based on funding, faculty fit, and career outcomes.",
  "author": {
    "@type": "Person",
    "name": "Dr. Jane Doe",
    "jobTitle": "Director of Graduate Studies",
    "affiliation": {
      "@type": "Organization",
      "name": "State University",
      "url": "https://stateuniversity.edu"
    },
    "url": "https://spanishacademic.com/authors/jane-doe",
    "sameAs": [
      "https://orcid.org/0000-0002-1234-5678",
      "https://scholar.google.com/citations?user=ABC123"
    ]
  },
  "reviewedBy": {
    "@type": "Person",
    "name": "Dr. John Smith",
    "jobTitle": "Associate Dean for Graduate Affairs",
    "affiliation": {
      "@type": "Organization",
      "name": "Major University"
    }
  },
  "datePublished": "2024-09-15",
  "dateModified": "2025-10-25",
  "publisher": {
    "@type": "Organization",
    "name": "Spanish Academic",
    "url": "https://spanishacademic.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://spanishacademic.com/logo.png"
    }
  },
  "citation": [
    "https://grad.columbia.edu/funding-faq",
    "https://www.mla.org/job-market-data",
    "https://www.nsf.gov/funding/education.jsp"
  ],
  "about": [
    {
      "@type": "EducationalOccupationalProgram",
      "name": "PhD in Spanish Linguistics",
      "description": "Doctoral program in Spanish linguistics research"
    }
  ]
}
</script>
```

**2. EducationalOccupationalProgram Schema (for program pages):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  "name": "Columbia University - PhD in Spanish Linguistics",
  "description": "Doctoral program in theoretical and applied Spanish linguistics with specializations in sociolinguistics, phonetics, and syntax.",
  "provider": {
    "@type": "Organization",
    "name": "Columbia University",
    "url": "https://columbia.edu"
  },
  "programType": "Doctoral",
  "educationalCredentialAwarded": "PhD",
  "timeToComplete": "P5Y",
  "financialAidEligible": "Yes",
  "offers": {
    "@type": "Offer",
    "category": "Tuition and Stipend",
    "price": "35000",
    "priceCurrency": "USD",
    "description": "Annual stipend with full tuition remission for 5 years"
  },
  "occupationalCredentialAwarded": "Research and Teaching in Higher Education",
  "url": "https://spanishacademic.com/programs/columbia-phd-spanish-linguistics.html"
}
</script>
```

**3. FAQ Schema (for Q&A pages):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a typical PhD stipend in Spanish linguistics?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "As of 2025-2026, PhD stipends in Spanish linguistics programs range from $18,000 to $35,000 annually. Most programs offer 5-year guaranteed funding packages with full tuition remission. Stipends vary by institution, geographic location, and program resources. Always verify current amounts directly with programs.",
        "author": {
          "@type": "Person",
          "name": "Dr. Jane Doe"
        },
        "dateCreated": "2025-10-25"
      }
    }
  ]
}
</script>
```

**4. Review Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Article",
    "name": "Graduate Funding Strategies"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "Verified",
    "bestRating": "Verified",
    "worstRating": "Unverified"
  },
  "author": {
    "@type": "Person",
    "name": "Dr. John Smith",
    "jobTitle": "Associate Dean for Graduate Affairs"
  },
  "reviewBody": "Reviewed for accuracy and currency of funding data. All cited sources verified as of October 2025.",
  "datePublished": "2025-10-25"
}
</script>
```

---

### H. Expertise, Authoritativeness, and Trust (E-E-A-T)

**Why it matters:**
Google's YMYL framework requires high standards of credibility for topics that can affect life outcomes.

**How to implement:**

**1. Author Attribution:**
```html
<article>
  <header class="article-header">
    <div class="author-info" itemscope itemtype="https://schema.org/Person">
      <img src="/authors/jane-doe.jpg" alt="Dr. Jane Doe" itemprop="image" class="author-photo">
      <div class="author-details">
        <h2 class="author-name" itemprop="name">Written by Dr. Jane Doe</h2>
        <p class="author-title" itemprop="jobTitle">Director of Graduate Studies, Department of Spanish & Portuguese</p>
        <p class="author-affiliation" itemprop="affiliation" itemscope itemtype="https://schema.org/Organization">
          <span itemprop="name">State University</span>
        </p>
        <p class="author-bio" itemprop="description">
          Dr. Doe has advised over 100 PhD students on funding, program selection, and career development since 2018. She holds a PhD in Hispanic Linguistics from UC Berkeley and serves on the MLA Committee on Graduate Education.
        </p>
        <p class="author-links">
          <a href="https://orcid.org/0000-0002-1234-5678" itemprop="sameAs" rel="author">ORCID</a> |
          <a href="https://scholar.google.com/citations?user=ABC123" itemprop="sameAs" rel="author">Google Scholar</a> |
          <a href="/authors/jane-doe" itemprop="url">Full Bio</a>
        </p>
      </div>
    </div>
  </header>

  <!-- article content -->
</article>
```

**2. Reviewer Section:**
```html
<section class="content-review">
  <h3>Expert Review</h3>
  <div class="reviewer" itemscope itemtype="https://schema.org/Person">
    <p><strong>Reviewed by:</strong> <span itemprop="name">Dr. John Smith</span>, <span itemprop="jobTitle">Associate Dean for Graduate Affairs</span>, <span itemprop="affiliation">Major University</span></p>
    <p itemprop="description">Dr. Smith oversees funding administration for 500+ graduate students and has 15 years of experience in graduate financial aid policy. He has published peer-reviewed research on graduate funding equity.</p>
    <p><strong>Review Date:</strong> <time datetime="2025-10-25">October 25, 2025</time></p>
    <p><strong>Review Notes:</strong> Verified all funding data against current university sources. Confirmed accuracy of stipend ranges and policy descriptions for AY 2025-2026.</p>
  </div>
</section>
```

**3. Institutional Accountability:**
```html
<footer class="article-footer">
  <section class="accountability">
    <h3>About Spanish Academic</h3>
    <p>Spanish Academic is an independent educational resource maintained by faculty and graduate students in Spanish linguistics, literature, and translation studies. We are not affiliated with any university's admissions or financial aid office.</p>
    <p><strong>Mission:</strong> Provide transparent, accurate information about graduate programs to help prospective students make informed decisions.</p>
    <p><strong>Editorial Standards:</strong> All content undergoes expert review. See our <a href="/about/editorial-standards">Editorial Standards</a> for details on our verification process.</p>
    <p><strong>Contact:</strong> <a href="/contact">Submit corrections or questions</a></p>
  </section>
</footer>
```

**4. Avoid Anonymous Authorship:**
```html
<!-- ❌ BAD -->
<p>Published by Spanish Academic Team</p>

<!-- ✅ GOOD -->
<p>Written by <a href="/authors/jane-doe">Dr. Jane Doe</a>, Director of Graduate Studies</p>
<p>Reviewed by <a href="/authors/john-smith">Dr. John Smith</a>, Associate Dean for Graduate Affairs</p>
<p>Edited by <a href="/authors/maria-garcia">Dr. Maria Garcia</a>, Professor of Spanish Linguistics</p>
```

---

### I. Avoid Misleading or Incomplete Content

**Why it matters:**
Google's Helpful Content System de-ranks thin or incomplete content.

**How to implement:**

**1. Provide context for all numerical claims:**
```html
<!-- ❌ BAD -->
<p>The average stipend is $25,000.</p>

<!-- ✅ GOOD -->
<p>Based on our analysis of 40 U.S. Spanish linguistics PhD programs, the <strong>median</strong> stipend for AY 2025-2026 is $25,000 (range: $18,000-$35,000). This figure represents the guaranteed base stipend and does not include:</p>
<ul>
  <li>Summer funding supplements</li>
  <li>Dissertation year fellowships</li>
  <li>External grants or awards</li>
  <li>Additional teaching opportunities</li>
</ul>
<p>Actual funding varies by:</p>
<ul>
  <li>Institution (public vs. private)</li>
  <li>Geographic location (cost of living adjustments)</li>
  <li>Program size and resources</li>
  <li>Number of years guaranteed</li>
</ul>
<p><a href="/data/stipend-methodology-2025">View complete methodology and data sources</a></p>
```

**2. Avoid mixing YMYL content with unrelated material:**
```html
<!-- ❌ BAD: Mixing funding advice with unrelated content -->
<article>
  <h1>Graduate Funding Guide</h1>
  <!-- funding content -->
  <h2>Also check out our blog posts about learning Spanish!</h2>
  <!-- unrelated language learning tips -->
</article>

<!-- ✅ GOOD: Focused, single-topic content -->
<article>
  <h1>Graduate Funding Guide</h1>
  <!-- funding content only -->
</article>

<aside class="related-content">
  <h2>Related Resources</h2>
  <ul>
    <li><a href="/help/funding-timeline">Funding Application Timeline</a></li>
    <li><a href="/help/external-fellowships">External Fellowship Opportunities</a></li>
  </ul>
</aside>
```

**3. Make data coverage explicit:**
```html
<section class="data-scope">
  <h2>Data Coverage and Limitations</h2>

  <h3>What This Data Includes:</h3>
  <ul>
    <li><strong>Programs:</strong> 40 U.S. doctoral programs in Spanish linguistics</li>
    <li><strong>Time Period:</strong> Academic year 2025-2026</li>
    <li><strong>Data Points:</strong> Base stipend, tuition remission, years guaranteed, health insurance</li>
    <li><strong>Sources:</strong> Official university graduate school websites, verified October 2025</li>
  </ul>

  <h3>What This Data Does NOT Include:</h3>
  <ul>
    <li>Master's programs (MA, MAT)</li>
    <li>International programs (non-U.S.)</li>
    <li>Variable funding (summer supplements, bonuses)</li>
    <li>Cost of living comparisons</li>
    <li>Tax implications</li>
  </ul>

  <h3>Known Limitations:</h3>
  <ul>
    <li>Some programs did not publish current stipend amounts publicly</li>
    <li>Figures represent guaranteed minimum; actual packages may be higher</li>
    <li>Data is point-in-time; amounts may change during application cycle</li>
  </ul>
</section>
```

---

### J. Accessibility and UX Integrity

**Why it matters:**
Accessibility contributes to overall page experience, which Google measures in ranking.

**How to implement:**

**1. Ensure disclaimers are legible:**
```html
<!-- ❌ BAD: Hidden or hard to read -->
<p style="font-size: 8px; color: #ccc;">Not financial advice</p>

<!-- ✅ GOOD: Clear, prominent, accessible -->
<aside class="disclaimer" role="complementary" style="font-size: 1rem; color: #333; padding: 1.5rem; background: #f8f9fa; border-left: 4px solid #0066cc;">
  <h3 style="margin-top: 0;">Financial Disclaimer</h3>
  <p>This content is for informational purposes only and does not constitute financial advice...</p>
</aside>
```

**2. Use semantic HTML and ARIA roles:**
```html
<article role="article" aria-labelledby="article-title">
  <header>
    <h1 id="article-title">Graduate Funding Strategies</h1>
  </header>

  <nav aria-label="Table of Contents">
    <h2>Contents</h2>
    <ol>
      <li><a href="#funding-types">Types of Funding</a></li>
      <li><a href="#stipend-comparison">Stipend Comparison</a></li>
    </ol>
  </nav>

  <section id="funding-types" aria-labelledby="funding-types-heading">
    <h2 id="funding-types-heading">Types of Funding</h2>
    <!-- content -->
  </section>

  <aside class="disclaimer" role="complementary" aria-label="Financial disclaimer">
    <h3>Disclaimer</h3>
    <!-- disclaimer text -->
  </aside>
</article>
```

**3. Avoid deceptive CTAs or manipulative design:**
```html
<!-- ❌ BAD: Deceptive call-to-action -->
<button class="huge-button">Click here for GUARANTEED funding!</button>

<!-- ✅ GOOD: Honest, clear CTAs -->
<a href="/help/funding-faq" class="btn-primary">Learn about funding options</a>
<a href="/programs/" class="btn-secondary">Browse programs with funding data</a>
```

**4. Keyboard and screen reader accessible:**
```html
<nav aria-label="Funding data by institution">
  <h2 id="funding-table-heading">Stipend Comparison Table</h2>
  <table aria-labelledby="funding-table-heading">
    <caption>PhD Stipend Amounts for AY 2025-2026</caption>
    <thead>
      <tr>
        <th scope="col">University</th>
        <th scope="col">Annual Stipend (USD)</th>
        <th scope="col">Years Guaranteed</th>
        <th scope="col">Last Verified</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Columbia University</th>
        <td>$35,000</td>
        <td>5 years</td>
        <td><time datetime="2025-10">Oct 2025</time></td>
      </tr>
      <!-- more rows -->
    </tbody>
  </table>
</nav>
```

---

### K. Version Control and Governance

**Why it matters:**
Maintaining an audit trail ensures accountability and allows corrections if challenged.

**How to implement:**

**1. Internal changelog (git commits):**
```bash
# Good commit messages for sensitive content
git commit -m "feat(funding): update Columbia stipend to $35k for AY 2025-2026

- Verified with official graduate school website
- Updated lastReviewed timestamp
- Source: https://grad.columbia.edu/funding (accessed 2025-10-25)

Reviewed-by: Dr. John Smith <jsmith@example.edu>"
```

**2. Archive prior versions:**
```
/archives/
  /funding-guide/
    2024-10-funding-guide.html
    2025-04-funding-guide.html
    2025-10-funding-guide.html (current)
```

**3. Assign content steward role:**
```html
<section class="content-governance">
  <h3>Content Stewardship</h3>
  <p><strong>Content Steward:</strong> Dr. Jane Doe (<a href="mailto:jdoe@spanishacademic.com">jdoe@spanishacademic.com</a>)</p>
  <p><strong>Review Schedule:</strong> Semi-annual (April and October)</p>
  <p><strong>Last Full Review:</strong> October 2025</p>
  <p><strong>Next Scheduled Review:</strong> April 2026</p>
  <p>The content steward is responsible for maintaining accuracy, coordinating reviews, and managing updates. For corrections or questions, contact the steward directly.</p>
</section>
```

**4. Document editorial process:**
```html
<!-- /about/editorial-process.html -->
<article>
  <h1>Editorial Process for Sensitive Content</h1>

  <section>
    <h2>Content Creation Workflow</h2>
    <ol>
      <li><strong>Research:</strong> Compile data from official sources</li>
      <li><strong>Draft:</strong> Author creates initial content with citations</li>
      <li><strong>Expert Review:</strong> Subject matter expert reviews for accuracy</li>
      <li><strong>Legal Review:</strong> Attorney reviews disclaimers for YMYL content</li>
      <li><strong>Copy Edit:</strong> Editor checks clarity, accessibility, style</li>
      <li><strong>Final Approval:</strong> Content steward approves for publication</li>
      <li><strong>Publish:</strong> Content goes live with metadata and schema</li>
      <li><strong>Archive:</strong> Previous version archived with timestamp</li>
    </ol>
  </section>

  <section>
    <h2>Update and Correction Process</h2>
    <ol>
      <li><strong>Issue Reported:</strong> Via feedback form, email, or internal review</li>
      <li><strong>Verification:</strong> Content steward verifies against official sources</li>
      <li><strong>Correction:</strong> Update made within 48 hours if confirmed</li>
      <li><strong>Changelog Entry:</strong> Document what changed and why</li>
      <li><strong>Notification:</strong> Acknowledge reporter, update lastModified date</li>
    </ol>
  </section>

  <section>
    <h2>Roles and Responsibilities</h2>
    <dl>
      <dt>Content Steward</dt>
      <dd>Overall accountability, review coordination, final approval</dd>

      <dt>Subject Matter Experts</dt>
      <dd>Verify accuracy, provide context, review technical content</dd>

      <dt>Legal Reviewer</dt>
      <dd>Review disclaimers, ensure YMYL compliance, mitigate legal risk</dd>

      <dt>Copy Editor</dt>
      <dd>Ensure clarity, readability, accessibility, style consistency</dd>
    </dl>
  </section>
</article>
```

---

### L. Localization and Jurisdiction

**Why it matters:**
Incorrect jurisdictional advice (e.g., visa, funding, taxation) can cause harm.

**How to implement:**

**1. Specify jurisdiction clearly:**
```html
<section class="jurisdiction-notice">
  <h2>Jurisdictional Scope</h2>
  <p><strong>Geographic Scope:</strong> United States only</p>
  <p><strong>Visa Information:</strong> Applicable to F-1 visa holders studying in the United States. Requirements differ for other visa types (J-1, H-1B, etc.) and change frequently.</p>
  <p><strong>Tax Information:</strong> U.S. federal tax implications only. State and local tax obligations vary. International students should consult a tax professional familiar with nonresident tax requirements.</p>
  <p><strong>Not Applicable To:</strong> Students studying outside the U.S., online programs based in other countries, or programs with international partnerships.</p>
</section>
```

**2. Include currency and locale:**
```html
<table>
  <caption>PhD Stipend Comparison (USD, before taxes)</caption>
  <thead>
    <tr>
      <th scope="col">University</th>
      <th scope="col">Annual Stipend (USD, gross)</th>
      <th scope="col">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Columbia University</th>
      <td>$35,000 USD (gross, before taxes)</td>
      <td>Subject to federal/state/local withholding. Net pay ~$28,000-30,000 depending on tax status.</td>
    </tr>
  </tbody>
</table>

<aside class="tax-note">
  <p><strong>Tax Note:</strong> Stipends are taxable income. U.S. citizens and resident aliens pay federal income tax. International students may be exempt from certain taxes under tax treaties but must file tax returns. Consult IRS Publication 970 and a tax professional.</p>
</aside>
```

**3. Avoid generic, unlocalized boilerplate:**
```html
<!-- ❌ BAD: Generic, no jurisdiction -->
<p>Students should check visa requirements.</p>

<!-- ✅ GOOD: Specific jurisdiction and resource -->
<p>International students in the United States on F-1 visas should verify work authorization limits with their Designated School Official (DSO) and review current <a href="https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment" rel="noopener">USCIS regulations for F-1 employment</a>. Requirements change; last verified October 2025.</p>
```

---

### M. Ethical and Legal Boundaries

**Why it matters:**
Unlicensed legal or financial advice can create liability.

**How to implement:**

**1. Never give individualized advice:**
```html
<!-- ❌ BAD: Individualized advice -->
<p>You should take the Columbia offer because their stipend is higher.</p>

<!-- ✅ GOOD: General information -->
<p>When comparing offers, consider factors beyond base stipend:</p>
<ul>
  <li>Cost of living in the city</li>
  <li>Number of years funding is guaranteed</li>
  <li>Health insurance coverage quality</li>
  <li>Summer funding opportunities</li>
  <li>Research and travel grants</li>
  <li>Advisor fit and mentorship quality</li>
</ul>
<p>Your personal priorities (geographic location, research interests, career goals) should guide your decision. Speak with current students and your academic mentors.</p>
```

**2. Use conditional phrasing:**
```html
<!-- ❌ BAD: Absolute statements -->
<p>All programs pay you for teaching.</p>

<!-- ✅ GOOD: Conditional, qualified -->
<p>Most PhD programs in Spanish linguistics (approximately 80-90% based on our survey) offer teaching assistantships with stipends. However:</p>
<ul>
  <li>Some programs offer fellowships without teaching requirements</li>
  <li>First-year packages may differ from later years</li>
  <li>Funding structures vary by institution</li>
</ul>
<p>Always confirm the specific funding structure with the program you're considering.</p>
```

**3. Direct users to authoritative sources:**
```html
<section class="get-professional-help">
  <h2>When to Consult Professionals</h2>

  <h3>Immigration Advice</h3>
  <p>For questions about visa status, work authorization, or immigration consequences of funding decisions:</p>
  <ul>
    <li>Contact your university's <strong>International Student Office</strong></li>
    <li>Consult a <strong>licensed immigration attorney</strong> (<a href="https://www.aila.org/" rel="noopener">Find AILA attorneys</a>)</li>
    <li>Review official guidance: <a href="https://www.uscis.gov" rel="noopener">USCIS.gov</a>, <a href="https://studyinthestates.dhs.gov/" rel="noopener">Study in the States</a></li>
  </ul>

  <h3>Financial Advice</h3>
  <p>For personalized financial planning, tax questions, or investment advice:</p>
  <ul>
    <li>Consult a <strong>Certified Financial Planner (CFP)</strong></li>
    <li>Speak with a <strong>CPA or tax professional</strong> familiar with student taxation</li>
    <li>Use your university's <strong>financial wellness resources</strong></li>
  </ul>

  <h3>Career Counseling</h3>
  <p>For individualized career guidance:</p>
  <ul>
    <li>Work with your university's <strong>career services office</strong></li>
    <li>Consult your <strong>academic advisor or dissertation committee</strong></li>
    <li>Join professional organizations: <a href="https://www.mla.org/" rel="noopener">MLA</a>, <a href="https://www.aatsp.org/" rel="noopener">AATSP</a></li>
  </ul>
</section>
```

---

### N. AI-Generated and Assisted Content

**Why it matters:**
Google allows AI-assisted content but still demands E-E-A-T standards.

**How to implement:**

**1. Disclosure of AI assistance:**
```html
<section class="content-production-notice">
  <h3>Content Production</h3>
  <p>This article was written by Dr. Jane Doe with assistance from AI tools for research compilation and initial drafting. All data, analysis, and recommendations were verified by Dr. Doe and reviewed by Dr. John Smith. AI was used to:</p>
  <ul>
    <li>Compile publicly available funding data from university websites</li>
    <li>Generate initial outline based on common student questions</li>
    <li>Suggest additional resources and citations</li>
  </ul>
  <p>All content underwent expert human review for accuracy, context, and appropriateness before publication.</p>
  <p><strong>Last Human Review:</strong> October 25, 2025 by Dr. Jane Doe</p>
</section>
```

**2. Require human expert review for YMYL:**
```html
<!-- Internal workflow documentation -->
<section class="editorial-policy">
  <h2>AI-Assisted Content Policy</h2>
  <p><strong>For YMYL Content (funding, visas, career advice):</strong></p>
  <ol>
    <li>AI may assist with research, data compilation, and initial drafting</li>
    <li><strong>Mandatory human expert review</strong> of all facts, data, and claims</li>
    <li>All citations must be verified by human reviewer against primary sources</li>
    <li>Expert reviewer must have relevant credentials and experience</li>
    <li>Disclosure of AI assistance required</li>
    <li>Human reviewer named and accountable</li>
  </ol>

  <p><strong>AI Cannot:</strong></p>
  <ul>
    <li>Provide final approval for publication</li>
    <li>Verify accuracy of sensitive data (must be human-verified)</li>
    <li>Replace expert judgment on context and appropriateness</li>
    <li>Write disclaimers without human legal review</li>
  </ul>
</section>
```

---

### O. Ethical Presentation and Monetization

**Why it matters:**
Overly commercial or manipulative YMYL content is rated low-quality.

**How to implement:**

**1. Keep ads separate from sensitive information:**
```html
<!-- ❌ BAD: Ads interrupting funding advice -->
<article>
  <h1>Graduate Funding Guide</h1>
  <p>Key funding strategies...</p>
  <div class="ad-banner">HUGE STUDENT LOAN AD</div>
  <p>...important stipend information...</p>
</article>

<!-- ✅ GOOD: Ads clearly separated -->
<article>
  <h1>Graduate Funding Guide</h1>
  <!-- Main content, no interruptions -->
</article>

<aside class="sidebar-ads" aria-label="Advertisements">
  <!-- Ads clearly labeled and separated -->
</aside>
```

**2. Clearly label sponsored or affiliate content:**
```html
<section class="sponsored-content">
  <p class="disclosure"><strong>Sponsored Content:</strong> The following resources are provided by our partners. We may earn a commission from qualifying purchases. Our editorial recommendations are independent and based on merit.</p>

  <div class="partner-resources">
    <h3>Recommended Tools</h3>
    <!-- Partner content -->
  </div>
</section>
```

**3. Avoid paywalls for critical information:**
```html
<!-- ❌ BAD: Paywall for basic visa info -->
<article>
  <h1>F-1 Visa Work Authorization Guide</h1>
  <p>The first 200 words are free...</p>
  <div class="paywall">Subscribe for $9.99/month to read more</div>
</article>

<!-- ✅ GOOD: Essential info free, premium extras optional -->
<article>
  <h1>F-1 Visa Work Authorization Guide</h1>
  <!-- Complete basic guide, free -->

  <aside class="premium-content">
    <h2>Premium Resources (Optional)</h2>
    <p>For personalized guidance, timeline templates, and case studies, consider our premium membership. <strong>Basic information remains free for all users.</strong></p>
  </aside>
</article>
```

---

## IV. Summary Table: Good, Better, Best

| Practice | Good (Current) | Better (Enhanced) | Best (Gold Standard) |
|----------|---------------|-------------------|---------------------|
| **Authoritativeness** | "Authored by" block | Include credentials, bio, and lived experience | Add multiple reviewers, institutional affiliation, ORCID, publications |
| **Freshness & Audit** | "Last reviewed" date | Add changelog and feedback form | Public changelog, scheduled reviews, archived versions, review calendar |
| **User Trust** | Disclaimer: "Not legal/financial advice" | Frame purpose positively, highlight transparency | Purpose statement, positive framing, multiple disclaimers by content type, professional referral links |
| **Structured Data** | Basic Article schema | Use reviewedBy, EducationalOccupationalProgram, and citation schema | Complete schema with author, reviewer, citations, FAQ schema, Review schema |
| **Experience** | N/A | Show real-world experience, case studies | Original research, surveys, anonymized examples, first-hand accounts |
| **Governance** | Manual updates | Schedule reviews, maintain audit logs | Content steward role, review calendar, archived versions, editorial process docs, internal audit trail |
| **Disclaimers** | Single generic disclaimer | Multiple specific disclaimers by content type | Context-specific disclaimers, positive framing, professional referrals, jurisdictional clarity |
| **Sources** | Links to universities | Primary sources with access dates | Citations with verification dates, methodology documentation, data coverage statements |
| **Accessibility** | Meets WCAG AA | Semantic HTML, ARIA roles | Full keyboard navigation, screen reader optimized, multiple formats available |

---

## V. Final Checklist Before Publishing Sensitive Content

### Pre-Publication Checklist

- [ ] **1. Verify Data Accuracy**
  - [ ] All data verified against primary official sources
  - [ ] Access/verification dates documented
  - [ ] Temporal scope clearly stated (AY 2025-2026, etc.)
  - [ ] Data limitations explicitly documented

- [ ] **2. Author and Reviewer Attribution**
  - [ ] Author bio with credentials and relevant experience
  - [ ] Author affiliation and contact information
  - [ ] Expert reviewer named with credentials
  - [ ] Review date documented
  - [ ] ORCID or other professional identifiers included

- [ ] **3. Disclaimers and Risk Mitigation**
  - [ ] Appropriate disclaimer(s) for content type (financial, legal, career, rankings)
  - [ ] Positive framing of content purpose
  - [ ] Clear statement of what content IS and IS NOT
  - [ ] Professional referral information provided

- [ ] **4. Freshness and Review Dates**
  - [ ] Publication date in HTML and metadata
  - [ ] Last updated date in HTML and metadata
  - [ ] Last reviewed date in HTML and metadata
  - [ ] Next review date scheduled and documented
  - [ ] Review cycle specified (6 months, 12 months, etc.)

- [ ] **5. Structured Data and Schema**
  - [ ] Article schema with author and reviewer
  - [ ] Educational program schema if applicable
  - [ ] FAQ schema for Q&A content
  - [ ] Citation schema for referenced sources
  - [ ] Review schema documenting expert verification

- [ ] **6. Changelog and Transparency**
  - [ ] Public changelog section on page
  - [ ] Feedback mechanism clearly visible
  - [ ] "How We Maintain Data" link or explanation
  - [ ] Update history documented

- [ ] **7. Accessibility and UX**
  - [ ] Semantic HTML structure
  - [ ] ARIA roles and labels
  - [ ] Keyboard navigation functional
  - [ ] Screen reader tested
  - [ ] Disclaimers prominent and legible
  - [ ] No deceptive design patterns

- [ ] **8. Jurisdictional Clarity**
  - [ ] Geographic scope specified (U.S., international, etc.)
  - [ ] Currency and locale specified (USD, gross vs. net)
  - [ ] Jurisdictional limitations stated (visa type, tax implications, etc.)
  - [ ] Links to authoritative jurisdictional sources (USCIS, IRS, etc.)

- [ ] **9. Ethical Boundaries**
  - [ ] No individualized advice
  - [ ] Conditional phrasing used ("typically," "in many cases")
  - [ ] Professional referral resources provided
  - [ ] Links to licensed professionals / official sources

- [ ] **10. AI and Human Review**
  - [ ] AI assistance disclosed if used
  - [ ] Human expert review completed for YMYL content
  - [ ] All facts and data verified by human reviewer
  - [ ] Reviewer accountability documented

- [ ] **11. Governance and Version Control**
  - [ ] Content steward assigned
  - [ ] Internal changelog maintained
  - [ ] Previous version archived
  - [ ] Git commit with detailed message
  - [ ] Review calendar entry created

- [ ] **12. Avoid Misleading Content**
  - [ ] No speculative or prescriptive advice
  - [ ] Context provided for all numerical claims
  - [ ] Data coverage explicitly stated
  - [ ] Limitations clearly documented
  - [ ] No vague, unsubstantiated claims

---

## VI. Implementation Priority by Content Type

### High Priority (Must Implement Before Publication)

**For ALL Sensitive Content:**
1. Author attribution with credentials
2. Expert reviewer with credentials and review date
3. Appropriate disclaimer(s) for content type
4. Last reviewed date in HTML and JSON
5. Structured data (Article schema minimum)
6. Primary source citations
7. Clear jurisdictional scope

**For Funding/Financial Content:**
1. Financial disclaimer
2. Currency and gross/net specification
3. Temporal scope (AY 2025-2026)
4. Verification dates for all amounts
5. Professional financial advisor referrals

**For Immigration/Visa Content:**
1. Legal disclaimer
2. Jurisdictional scope (U.S., visa type)
3. Links to USCIS, DSO resources
4. Immigration attorney referrals
5. "Not legal advice" prominent

**For Career/Job Market Content:**
1. Career disclaimer
2. "No guarantees" statement
3. Data sources and methodology
4. Career services referrals
5. Conditional phrasing

**For Rankings/Comparisons:**
1. Ranking disclaimer
2. Methodology limitations
3. Subjectivity acknowledgment
4. "One factor among many" framing

### Medium Priority (Implement Within 30 Days)

1. Public changelog section
2. Feedback mechanism
3. Educational program schema (if applicable)
4. FAQ schema (if Q&A format)
5. Content review calendar entry
6. Archive previous version
7. "How We Maintain Data" documentation

### Lower Priority (Implement Within 90 Days)

1. Original research / surveys
2. Case studies and examples
3. Multiple reviewer verification
4. Advanced schema (Review, Citation)
5. Complete editorial process documentation
6. Public review calendar

---

## VII. Monitoring and Maintenance

### Ongoing Responsibilities

**Monthly:**
- Monitor for reported errors or outdated information
- Check for broken links to official sources
- Review analytics for user questions/concerns

**Quarterly:**
- Spot-check high-impact data (top 10 cited figures)
- Verify no major policy changes at referenced institutions
- Update any time-sensitive information

**Semi-Annually:**
- Complete full content review
- Verify all citations against current official sources
- Update lastReviewed dates
- Add changelog entries
- Archive previous version

**Annually:**
- Complete methodology review
- Update editorial standards if needed
- Review and refresh examples and case studies
- Assess user feedback themes
- Update author/reviewer bios

---

**End of Comprehensive YMYL/E-E-A-T Guidelines**

*These guidelines ensure Spanish Academic maintains the highest standards for sensitive content, protecting users and building long-term trust and authority.*
