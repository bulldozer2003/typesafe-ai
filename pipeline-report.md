# TypeSafe Jev Pipeline Report

**Input:** `response.md`

```
"Best" is subjective, but based on available ratings and reviews, here's what stands out in Champaign, IL:

**Top-rated option:**
- **Dr. Craig D. Neitzel, MD – Carle Dermatology** — 4.8 out of 5 stars across 942 ratings and 214 written reviews on Carle's site (per Carle's find-a-doctor page). Patient comments repeatedly praise him as "the best dermatologist" in the area. He practices at Carle Champaign on Curtis Road.

**Other well-regarded options:**
- **Christie Clinic Dermatology** (101 W. University Ave, Champaign) — has multiple board-certified dermatologists (MD, FAAD), including Dr. Kathryn Lane, Dr. Lori Fiessinger, Dr. Caitlyn Foote, and Dr. Eleni Moraites.
- **VitalSkin Dermatology** (formerly Illinois Dermatology Center, Champaign-Urbana) — board-certified dermatologists including Dr. Jeremy Youse, offering medical, surgical, and cosmetic dermatology.
- On Yelp, **Jacobsen Ellen MD** currently holds a 5/5 rating among local dermatology-related listings.

A few practical tips: check whether a provider accepts your insurance, consider whether you need medical, surgical, or cosmetic dermatology (needs differ), and you can verify board certification through the American Academy of Dermatology's directory.

Would you like me to search for more detail on any of these providers, such as availability or specialty areas?

```

---

## Step 1: Split into blocks

**7 blocks** produced from the input.

### Block 0
```
"Best" is subjective, but based on available ratings and reviews, here's what stands out in Champaign, IL:
```

### Block 1
```
**Top-rated option:** – **Dr. Craig D. Neitzel, MD – Carle Dermatology** — 4.8 out of 5 stars across 942 ratings and 214 written reviews on Carle's site (per Carle's find-a-doctor page). Patient comments repeatedly praise him as "the best dermatologist" in the area. He practices at Carle Champaign on Curtis Road.
```

### Block 2
```
**Other well-regarded options:** – **Christie Clinic Dermatology** (101 W. University Ave, Champaign) — has multiple board-certified dermatologists (MD, FAAD), including Dr. Kathryn Lane, Dr. Lori Fiessinger, Dr. Caitlyn Foote, and Dr. Eleni Moraites.
```

### Block 3
```
**Other well-regarded options:** – **VitalSkin Dermatology** (formerly Illinois Dermatology Center, Champaign-Urbana) — board-certified dermatologists including Dr. Jeremy Youse, offering medical, surgical, and cosmetic dermatology.
```

### Block 4
```
**Other well-regarded options:** – On Yelp, **Jacobsen Ellen MD** currently holds a 5/5 rating among local dermatology-related listings.
```

### Block 5
```
A few practical tips: check whether a provider accepts your insurance, consider whether you need medical, surgical, or cosmetic dermatology (needs differ), and you can verify board certification through the American Academy of Dermatology's directory.
```

### Block 6
```
Would you like me to search for more detail on any of these providers, such as availability or specialty areas?
```

---

## Step 2: Classify each block (Jev Noul + Choice)

**Model:** jev-latest  
**Noul threshold:** 0.5

### Classify call – Block 2

#### Request

```json
{
  "state": "**Other well-regarded options:** – **Christie Clinic Dermatology** (101 W. University Ave, Champaign) — has multiple board-certified dermatologists (MD, FAAD), including Dr. Kathryn Lane, Dr. Lori Fiessinger, Dr. Caitlyn Foote, and Dr. Eleni Moraites.",
  "model": "jev-latest",
  "questions": {
    "is_provider": {
      "type": "noul",
      "instructions": "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?"
    },
    "endorsement": {
      "type": "choice",
      "instructions": "How does this text describe the provider?",
      "criteria": {
        "top_pick": "Explicitly called the single best or top-rated option",
        "endorsed": "Listed as well-regarded with positive details or praise",
        "mentioned": "Listed neutrally without particular praise or criticism",
        "not_provider": "Not naming or recommending a specific provider"
      }
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_provider": {
      "type": "noul",
      "noul": 0.99
    },
    "endorsement": {
      "type": "choice",
      "choice": "endorsed",
      "confidence": 1,
      "probabilities": {
        "not_provider": 0,
        "mentioned": 0,
        "top_pick": 0,
        "endorsed": 1
      }
    }
  },
  "usage": {
    "input_tokens": 479,
    "output_tokens": 70
  }
}
```

### Classify call – Block 6

#### Request

```json
{
  "state": "Would you like me to search for more detail on any of these providers, such as availability or specialty areas?",
  "model": "jev-latest",
  "questions": {
    "is_provider": {
      "type": "noul",
      "instructions": "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?"
    },
    "endorsement": {
      "type": "choice",
      "instructions": "How does this text describe the provider?",
      "criteria": {
        "top_pick": "Explicitly called the single best or top-rated option",
        "endorsed": "Listed as well-regarded with positive details or praise",
        "mentioned": "Listed neutrally without particular praise or criticism",
        "not_provider": "Not naming or recommending a specific provider"
      }
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_provider": {
      "type": "noul",
      "noul": 0.04
    },
    "endorsement": {
      "type": "choice",
      "choice": "not_provider",
      "confidence": 0.98,
      "probabilities": {
        "mentioned": 0.02,
        "top_pick": 0,
        "not_provider": 0.98,
        "endorsed": 0
      }
    }
  },
  "usage": {
    "input_tokens": 423,
    "output_tokens": 69
  }
}
```

### Classify call – Block 0

#### Request

```json
{
  "state": "\"Best\" is subjective, but based on available ratings and reviews, here's what stands out in Champaign, IL:",
  "model": "jev-latest",
  "questions": {
    "is_provider": {
      "type": "noul",
      "instructions": "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?"
    },
    "endorsement": {
      "type": "choice",
      "instructions": "How does this text describe the provider?",
      "criteria": {
        "top_pick": "Explicitly called the single best or top-rated option",
        "endorsed": "Listed as well-regarded with positive details or praise",
        "mentioned": "Listed neutrally without particular praise or criticism",
        "not_provider": "Not naming or recommending a specific provider"
      }
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_provider": {
      "type": "noul",
      "noul": 0.03
    },
    "endorsement": {
      "type": "choice",
      "choice": "not_provider",
      "confidence": 0.92,
      "probabilities": {
        "endorsed": 0.05,
        "mentioned": 0.01,
        "not_provider": 0.94,
        "top_pick": 0
      }
    }
  },
  "usage": {
    "input_tokens": 427,
    "output_tokens": 69
  }
}
```

### Classify call – Block 5

#### Request

```json
{
  "state": "A few practical tips: check whether a provider accepts your insurance, consider whether you need medical, surgical, or cosmetic dermatology (needs differ), and you can verify board certification through the American Academy of Dermatology's directory.",
  "model": "jev-latest",
  "questions": {
    "is_provider": {
      "type": "noul",
      "instructions": "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?"
    },
    "endorsement": {
      "type": "choice",
      "instructions": "How does this text describe the provider?",
      "criteria": {
        "top_pick": "Explicitly called the single best or top-rated option",
        "endorsed": "Listed as well-regarded with positive details or praise",
        "mentioned": "Listed neutrally without particular praise or criticism",
        "not_provider": "Not naming or recommending a specific provider"
      }
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_provider": {
      "type": "noul",
      "noul": 0.03
    },
    "endorsement": {
      "type": "choice",
      "choice": "not_provider",
      "confidence": 1,
      "probabilities": {
        "endorsed": 0,
        "mentioned": 0,
        "not_provider": 1,
        "top_pick": 0
      }
    }
  },
  "usage": {
    "input_tokens": 448,
    "output_tokens": 69
  }
}
```

### Classify call – Block 4

#### Request

```json
{
  "state": "**Other well-regarded options:** – On Yelp, **Jacobsen Ellen MD** currently holds a 5/5 rating among local dermatology-related listings.",
  "model": "jev-latest",
  "questions": {
    "is_provider": {
      "type": "noul",
      "instructions": "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?"
    },
    "endorsement": {
      "type": "choice",
      "instructions": "How does this text describe the provider?",
      "criteria": {
        "top_pick": "Explicitly called the single best or top-rated option",
        "endorsed": "Listed as well-regarded with positive details or praise",
        "mentioned": "Listed neutrally without particular praise or criticism",
        "not_provider": "Not naming or recommending a specific provider"
      }
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_provider": {
      "type": "noul",
      "noul": 0.98
    },
    "endorsement": {
      "type": "choice",
      "choice": "endorsed",
      "confidence": 1,
      "probabilities": {
        "endorsed": 1,
        "top_pick": 0,
        "not_provider": 0,
        "mentioned": 0
      }
    }
  },
  "usage": {
    "input_tokens": 436,
    "output_tokens": 70
  }
}
```

### Classify call – Block 1

#### Request

```json
{
  "state": "**Top-rated option:** – **Dr. Craig D. Neitzel, MD – Carle Dermatology** — 4.8 out of 5 stars across 942 ratings and 214 written reviews on Carle's site (per Carle's find-a-doctor page). Patient comments repeatedly praise him as \"the best dermatologist\" in the area. He practices at Carle Champaign on Curtis Road.",
  "model": "jev-latest",
  "questions": {
    "is_provider": {
      "type": "noul",
      "instructions": "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?"
    },
    "endorsement": {
      "type": "choice",
      "instructions": "How does this text describe the provider?",
      "criteria": {
        "top_pick": "Explicitly called the single best or top-rated option",
        "endorsed": "Listed as well-regarded with positive details or praise",
        "mentioned": "Listed neutrally without particular praise or criticism",
        "not_provider": "Not naming or recommending a specific provider"
      }
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_provider": {
      "type": "noul",
      "noul": 0.99
    },
    "endorsement": {
      "type": "choice",
      "choice": "top_pick",
      "confidence": 1,
      "probabilities": {
        "not_provider": 0,
        "mentioned": 0,
        "top_pick": 1,
        "endorsed": 0
      }
    }
  },
  "usage": {
    "input_tokens": 494,
    "output_tokens": 69
  }
}
```

### Classify call – Block 3

#### Request

```json
{
  "state": "**Other well-regarded options:** – **VitalSkin Dermatology** (formerly Illinois Dermatology Center, Champaign-Urbana) — board-certified dermatologists including Dr. Jeremy Youse, offering medical, surgical, and cosmetic dermatology.",
  "model": "jev-latest",
  "questions": {
    "is_provider": {
      "type": "noul",
      "instructions": "Does this text name a specific healthcare provider (doctor, clinic, or practice) and say something about them?"
    },
    "endorsement": {
      "type": "choice",
      "instructions": "How does this text describe the provider?",
      "criteria": {
        "top_pick": "Explicitly called the single best or top-rated option",
        "endorsed": "Listed as well-regarded with positive details or praise",
        "mentioned": "Listed neutrally without particular praise or criticism",
        "not_provider": "Not naming or recommending a specific provider"
      }
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_provider": {
      "type": "noul",
      "noul": 0.99
    },
    "endorsement": {
      "type": "choice",
      "choice": "endorsed",
      "confidence": 1,
      "probabilities": {
        "not_provider": 0,
        "mentioned": 0,
        "endorsed": 1,
        "top_pick": 0
      }
    }
  },
  "usage": {
    "input_tokens": 461,
    "output_tokens": 70
  }
}
```

---

## Step 3: Extract names (code heuristic)

Heuristic: grab last non-header bold text `**...**` from each provider block.

```
Block 2: "Christie Clinic Dermatology"
Block 4: "Jacobsen Ellen MD"
Block 1: "Dr. Craig D. Neitzel, MD – Carle Dermatology"
Block 3: "VitalSkin Dermatology"
```

---

## Step 4: Verify extracted names (Jev Noul)

### Verify call – Block 1

#### Request

```json
{
  "state": {
    "name": "Dr. Craig D. Neitzel, MD – Carle Dermatology",
    "context": "**Top-rated option:** – **Dr. Craig D. Neitzel, MD – Carle Dermatology** — 4.8 out of 5 stars across 942 ratings and 214 written reviews on Carle's site (per Carle's find-a-doctor page). Patient comments repeatedly praise him as \"the best dermatologist\" in the area. He practices at Carle Champaign on Curtis Road."
  },
  "model": "jev-latest",
  "questions": {
    "match": {
      "type": "noul",
      "instructions": "Is \"Dr. Craig D. Neitzel, MD – Carle Dermatology\" the healthcare provider being discussed in the surrounding text?"
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "match": {
      "type": "noul",
      "noul": 0.98
    }
  },
  "usage": {
    "input_tokens": 417,
    "output_tokens": 20
  }
}
```

### Verify call – Block 2

#### Request

```json
{
  "state": {
    "name": "Christie Clinic Dermatology",
    "context": "**Other well-regarded options:** – **Christie Clinic Dermatology** (101 W. University Ave, Champaign) — has multiple board-certified dermatologists (MD, FAAD), including Dr. Kathryn Lane, Dr. Lori Fiessinger, Dr. Caitlyn Foote, and Dr. Eleni Moraites."
  },
  "model": "jev-latest",
  "questions": {
    "match": {
      "type": "noul",
      "instructions": "Is \"Christie Clinic Dermatology\" the healthcare provider being discussed in the surrounding text?"
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "match": {
      "type": "noul",
      "noul": 0.98
    }
  },
  "usage": {
    "input_tokens": 384,
    "output_tokens": 20
  }
}
```

### Verify call – Block 3

#### Request

```json
{
  "state": {
    "name": "VitalSkin Dermatology",
    "context": "**Other well-regarded options:** – **VitalSkin Dermatology** (formerly Illinois Dermatology Center, Champaign-Urbana) — board-certified dermatologists including Dr. Jeremy Youse, offering medical, surgical, and cosmetic dermatology."
  },
  "model": "jev-latest",
  "questions": {
    "match": {
      "type": "noul",
      "instructions": "Is \"VitalSkin Dermatology\" the healthcare provider being discussed in the surrounding text?"
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "match": {
      "type": "noul",
      "noul": 0.96
    }
  },
  "usage": {
    "input_tokens": 366,
    "output_tokens": 20
  }
}
```

### Verify call – Block 4

#### Request

```json
{
  "state": {
    "name": "Jacobsen Ellen MD",
    "context": "**Other well-regarded options:** – On Yelp, **Jacobsen Ellen MD** currently holds a 5/5 rating among local dermatology-related listings."
  },
  "model": "jev-latest",
  "questions": {
    "match": {
      "type": "noul",
      "instructions": "Is \"Jacobsen Ellen MD\" the healthcare provider being discussed in the surrounding text?"
    }
  }
}
```

#### Response

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "match": {
      "type": "noul",
      "noul": 0.96
    }
  },
  "usage": {
    "input_tokens": 337,
    "output_tokens": 20
  }
}
```

---

## Final result

```json
{
  "providers": [
    {
      "name": "Dr. Craig D. Neitzel, MD – Carle Dermatology",
      "endorsement": "top_pick",
      "confidence": 1,
      "detail": "**Top-rated option:** – **Dr. Craig D. Neitzel, MD – Carle Dermatology** — 4.8 out of 5 stars across 942 ratings and 214 written reviews on Carle's site (per Carle's find-a-doctor page). Patient comments repeatedly praise him as \"the best dermatologist\" in the area. He practices at Carle Champaign on Curtis Road."
    },
    {
      "name": "Christie Clinic Dermatology",
      "endorsement": "endorsed",
      "confidence": 1,
      "detail": "**Other well-regarded options:** – **Christie Clinic Dermatology** (101 W. University Ave, Champaign) — has multiple board-certified dermatologists (MD, FAAD), including Dr. Kathryn Lane, Dr. Lori Fiessinger, Dr. Caitlyn Foote, and Dr. Eleni Moraites."
    },
    {
      "name": "VitalSkin Dermatology",
      "endorsement": "endorsed",
      "confidence": 1,
      "detail": "**Other well-regarded options:** – **VitalSkin Dermatology** (formerly Illinois Dermatology Center, Champaign-Urbana) — board-certified dermatologists including Dr. Jeremy Youse, offering medical, surgical, and cosmetic dermatology."
    },
    {
      "name": "Jacobsen Ellen MD",
      "endorsement": "endorsed",
      "confidence": 1,
      "detail": "**Other well-regarded options:** – On Yelp, **Jacobsen Ellen MD** currently holds a 5/5 rating among local dermatology-related listings."
    }
  ]
}
```
