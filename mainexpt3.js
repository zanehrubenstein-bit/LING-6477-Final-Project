// ------------------------------------------------------------------
// GLOBAL SETTINGS
// ------------------------------------------------------------------
PennController.ResetPrefix(null);
DebugOff();   

// ------------------------------------------------------------------
// SEQUENCE
// ------------------------------------------------------------------
Sequence(
    "consent",
    "native_check",
    "demographics",
    "instructions",
    "practice_intro",
    randomize("practice"),
    "practice_end",
    "exp_intro",
    rshuffle("experimental", "filler"),
    "send",
    "debrief"
);

// ------------------------------------------------------------------
// CONSENT
// ------------------------------------------------------------------
newTrial("consent",
    defaultText
        .css("font-size", "16px")
        .css("line-height", "1.6")
        .center()
        .print(),

    newText("title", "<h2>Consent to Participate</h2>"),
    newText("body",
        "<p>Thank you very much for your participation! This experiment is part of a " +
        "Cornell University scientific research project. Your decision to participate " +
        "is voluntary. There is no way for us to identify you. The only information we will have, " +
        "in addition to your responses, is the time at which you completed the survey. " +
        "The results of the research will be presented in a final project paper. </p>" +
        "<p><b>Clicking on the link below indicates that you are at least 18 years " +
        "of age and agree to complete this experiment voluntarily.</b></p> "
        
    ),
    newButton("agree", "I Agree – Start the Study")
        .css("margin-top", "20px")
        .center()
        .print()
        .wait()
);

// ------------------------------------------------------------------
// NATIVE SPEAKER CHECK
// ------------------------------------------------------------------
newTrial("native_check",
    defaultText.css("font-size", "16px")
    .print(),

    newText("q_native",
        "<p><strong>Is English your native language " +
        "(the first language you learned as a child at home)?</strong></p>"
    ),
    newScale("native", "Yes", "No")
        .labelsPosition("right")
        .center()
        .vertical()
        .print(),
    newText("warn_native",
        "⚠ Please select an answer before continuing.")
        .css("color", "red").css("font-size", "14px")
        .remove(),
    newButton("next_native", "Continue")
        .css("margin-top", "20px").center().print()
        .wait(
            getScale("native").test.selected()
                .failure( getText("warn_native").print() )
        ),

    // Hard stop for non-native speakers
    getScale("native").test.selected("No")
        .success(
            newText("stop_msg",
                "<div style='text-align:center; margin-top:40px;'>" +
                "<p style='color:red; font-weight:bold; font-size:18px;'>" +
                "Thank you for your interest.</p>" +
                "<p>Unfortunately this study is open only to native English speakers. " +
                "You may close this window.</p></div>"
            ).print(),
            newButton("halt","").remove().wait()  // never prints — halts sequence
        )
);

// ------------------------------------------------------------------
// DEMOGRAPHICS
// ------------------------------------------------------------------
newTrial("demographics",
    defaultText.css("font-size", "16px").css("line-height", "1.6")
    .print(),

    newText("demo_head", "<h3>Before we begin – a few quick questions:</h3>")
    .center(),

    newText("age_label", "<p><strong>What is your age?</strong></p>"),
    newTextInput("age_input", "")
        .css("width", "40px").center().print(),
    newText("age_hint", "<small>Enter a whole number (e.g. 24)</small>").center(),

    newText("br1", "<br>"),
    newText("dialect_label",
        "<p><strong>What variety or dialect of English did you grow up speaking?</strong><br>" +
        "<small>(e.g. American English, British English, Australian English, etc.)</small></p>"
    ),
    newScale("dialect_scale",
    "American English",
    "British English",
    "Australian English",
    "Other"
    )
    .labelsPosition("right")
    .vertical()
    .center()
    .print()
    .wait(),
    getScale("dialect_scale").log(),
    newVar("VAR_dialect").global().set(getScale("dialect_scale")),

    newButton("submit_demo","Continue")
        .css("margin-top","20px").center().print()
        .center()
        .print()
        .wait(),
    
    newVar("VAR_age").global().set(v => parseInt(getTextInput("age_input").value)),
    getVar("VAR_age").test.is(v => v < 18)
        .success(
            newText("stop_age",
                "<p style='color:red; font-weight:bold;'>" +
                "You must be at least 18 years old to participate. " +
                "You may close this window.</p>"
            ).center().print(),
            newButton("halt_age","").remove().wait()
        )
);

// ------------------------------------------------------------------
// INSTRUCTIONS
// ------------------------------------------------------------------
newTrial("instructions",
    defaultText.css("font-size","16px").css("line-height","1.6")
    .center()
    .print(),

    newText("inst_head","<h2>Task Instructions</h2>"),
    newText("inst_body",
        "<p>In this study you will read a series of sentences in English and " +
        "judge <strong>how acceptable</strong> they sound as natural English.</p>" +

        "<p>You will rate the sentences on a scale from <strong>1–5 </strong>. " +
        "The meaning of each scale rating is as follows:</p>" +

        "<table style='border-collapse:collapse; margin:12px auto; font-size:15px;'>" +
        "<tr style='background:#ddd;'>" +
        "<th style='padding:7px 14px; border:1px solid #aaa;'>Rating</th>" +
        "<th style='padding:7px 14px; border:1px solid #aaa;'>Meaning</th></tr>" +
        "<tr><td style='padding:6px 14px; border:1px solid #aaa; text-align:center;'>1</td>" +
        "<td style='padding:6px 14px; border:1px solid #aaa;'>Completely unacceptable – no native speaker would say this</td></tr>" +
        "<tr><td style='padding:6px 14px; border:1px solid #aaa; text-align:center;'>2</td>" +
        "<td style='padding:6px 14px; border:1px solid #aaa;'>Mostly unacceptable</td></tr>" +
        "<tr><td style='padding:6px 14px; border:1px solid #aaa; text-align:center;'>3</td>" +
        "<td style='padding:6px 14px; border:1px solid #aaa;'>Neither acceptable nor unacceptable / unsure</td></tr>" +
        "<tr><td style='padding:6px 14px; border:1px solid #aaa; text-align:center;'>4</td>" +
        "<td style='padding:6px 14px; border:1px solid #aaa;'>Mostly acceptable</td></tr>" +
        "<tr><td style='padding:6px 14px; border:1px solid #aaa; text-align:center;'>5</td>" +
        "<td style='padding:6px 14px; border:1px solid #aaa;'>Perfectly acceptable – you can easily imagine a native speaker saying this</td></tr>" +
        "</table>" +

        "<p><strong>Important:</strong> Judge <em>grammatical acceptability</em>, " +
        "<strong>not plausibility or likelihood</strong>. A sentence can describe " +
        "a very unlikely or even impossible event and still be perfectly acceptable English. " +
        "For example:</p>" +

        "<blockquote style='background:#f5f5f5; padding:10px 18px; border-left:4px solid #888; margin:10px 0;'>" +
        "<em>The cat decided to run for mayor of the city.</em>" +
        "</blockquote>" +
        "<p>This is implausible, but it is <strong>grammatically perfect</strong> – " +
        "you should rate it a <strong>5</strong>. </p>" +
        "<p>By contrast:</p>" +

        "<blockquote style='background:#f5f5f5; padding:10px 18px; border-left:4px solid #888; margin:10px 0;'>" +
        "<em>Cat the mayor city the ran for decided of.</em>" +
        "</blockquote>" +
        "<p>This is <strong>unacceptable</strong> (rate it 1) even though the same words appear.</p>" +

        "<p>There is no time limit. Work at a comfortable pace. " +
        "You will do a short <strong>practice</strong> first, with feedback.</p>"
    ),
    newButton("go_practice","Begin Practice")
        .css("margin-top","20px").center().print().wait()
);

// ------------------------------------------------------------------
// PRACTICE INTRO
// ------------------------------------------------------------------
newTrial("practice_intro",
    newText("pi",
        "<h3>Practice Trials</h3>" +
        "<p>You will now see <strong>4 practice sentences</strong>. " +
        "Rate each one, then click <em>Submit &amp; See Feedback</em> to " +
        "reveal an explanation. This will help you calibrate your judgments " +
        "before the main experiment begins.</p>"
    )
    .css("font-size","16px")
    .css("line-height","1.6")
    .print(),
    
    newButton("start_prac","Start Practice")
        .css("margin-top","20px").center().print()
        .center()
        .print()
        .wait(),
);

// ------------------------------------------------------------------
// PRACTICE TRIALS
// ------------------------------------------------------------------
// P1 – Clearly acceptable (target 5)
newTrial("practice",
    newText("sent","<p>The student finished the assignment and then went to bed.</p>")
        .center().print(),
    newText("rlabel","<p>How acceptable is this sentence?</p>")
        .center().print(),
    newScale("rating","1","2","3","4","5")
        .labelsPosition("bottom")
        .center()
        .print()
        .wait(),
    newButton("submit","Submit &amp; See Feedback").css("margin-top","14px").center().print().wait(),
    newText("fb",
        "<div style='background:#eef6ff;border:1px solid #99c;padding:14px;border-radius:6px;margin-top:12px;font-size:15px;line-height:1.5;'>" +
        "<strong>Feedback</strong> – Expected rating: <strong>5</strong><br><br>" +
        "This is a perfectly ordinary, grammatically well-formed English sentence. Rate it a <strong>5</strong>.</div>"
    ).print(),
    newButton("nxt","Next →").css("margin-top","12px").center().print().wait(),
);

// P2 – Implausible but grammatical (target 5)
newTrial("practice",
    newText("sent","<p>The toaster decided to run for president.</p>")
        .center().print(),
    newText("rlabel","<p>How acceptable is this sentence?</p>")
        .center().print(),
    newScale("rating","1","2","3","4","5")
        .labelsPosition("bottom")
        .center()
        .print()
        .wait(),
    newButton("submit","Submit &amp; See Feedback").css("margin-top","14px").center().print().wait(),
    newText("fb",
        "<div style='background:#eef6ff;border:1px solid #99c;padding:14px;border-radius:6px;margin-top:12px;font-size:15px;line-height:1.5;'>" +
        "<strong>Feedback</strong> – Expected rating: <strong>5</strong><br><br>" +
        "This describes something impossible, but the sentence is grammatically <em>perfect</em>. " +
        "<strong>Plausibility ≠ grammatical acceptability.</strong> Rate it a <strong>5</strong>.</div>"
    ).print(),
    newButton("nxt","Next →").css("margin-top","12px").center().print().wait(),
);

// P3 – Word salad / clearly ungrammatical (target 1)
newTrial("practice",
    newText("sent","<p>Quickly ran the very though suddenly.</p>")
        .center().print(),
    newText("rlabel","<p>How acceptable is this sentence?</p>")
        .center().print(),
    newScale("rating","1","2","3","4","5")
        .labelsPosition("bottom")
        .center()
        .print()
        .wait(),
    newButton("submit","Submit &amp; See Feedback").css("margin-top","14px").center().print().wait(),
    newText("fb",
        "<div style='background:#eef6ff;border:1px solid #99c;padding:14px;border-radius:6px;margin-top:12px;font-size:15px;line-height:1.5;'>" +
        "<strong>Feedback</strong> – Expected rating: <strong>1</strong><br><br>" +
        "These words cannot be assembled into any grammatical English sentence in this order. " +
        "Rate word-salad sentences like this a <strong>1</strong>.</div>"
    ).print(),
    newButton("nxt","Next →").css("margin-top","12px").center().print().wait(),
);

// P4 – Understandable but some grammatical errors (target 3)
newTrial("practice",
    newText("sent","<p>He go to the store yesterday for buy milk.</p>")
        .center().print(),
    newText("rlabel","<p>How acceptable is this sentence?</p>")
        .center().print(),
    newScale("rating","1","2","3","4","5")
        .labelsPosition("bottom")
        .center()
        .print()
        .wait(),
    newButton("submit","Submit &amp; See Feedback").css("margin-top","14px").center().print().wait(),
    newText("fb",
        "<div style='background:#eef6ff;border:1px solid #99c;padding:14px;border-radius:6px;margin-top:12px;font-size:15px;line-height:1.5;'>" +
        "<strong>Feedback</strong> – Expected rating: <strong>3</strong><br><br>" +
        "This sentence has a few grammatical errors but can still be understood by a native English speaker. " +
        "Rate sentences with grammatical errors that don't necessarily impede understanding a <strong>3</strong>.</div>"
    ).print(),
    newButton("nxt","Next →").css("margin-top","12px").center().print().wait(),
);

// ------------------------------------------------------------------
// PRACTICE END
// ------------------------------------------------------------------

newTrial("practice_end",
    newText("pe",
        "<h3>Practice Complete</h3>" +
        "<p>You have finished the practice. A quick reminder:</p>" +
        "<ul style='line-height:1.8;'>" +
        "<li>Judge <strong>grammatical acceptability</strong>, not whether the event described is plausible.</li>" +
        "<li>Use the <strong>full 1–5 scale</strong> – try not to cluster all your ratings.</li>" +
        "<li>There is no time limit. Work at a comfortable pace.</li>" +
        "</ul>" +
        "<p>The main experiment now begins. <strong>No feedback will be given from here on.</strong></p>"
    ).css("font-size","16px").css("line-height","1.6").center().print(),
    newButton("go_exp","Begin Main Experiment →").center().print().wait()
);

// ------------------------------------------------------------------
// EXPERIMENT INTRO
// ------------------------------------------------------------------
newTrial("exp_intro",
    newText("ei",
        "<p style='font-size:16px; line-height:1.6;'>" +
        "You will now rate <strong>72 sentences</strong> in total. " +
        "Select a number from <strong>1</strong> (completely unacceptable) to " +
        "<strong>5</strong> (perfectly acceptable) for each one, " +
        "then click <em>Next</em> to proceed.</p>"
    )
        .center().print(),
    newButton("go","OK – let's start").center().print().wait()
);

// ------------------------------------------------------------------
// TRIAL TEMPLATE
// ------------------------------------------------------------------
// PCIbex reads the "group" column automatically:
//   - Rows with group A/B/C/D: rotated across participants.
//   - Each participant sees exactly one variant per item.
//   - Rows with group "filler": shown to every participant.

Template("poppels_kehler_expt3.csv",
    row => newTrial(row.trial_type,

        // ── Stimulus ─────────────────────────────────────
        newText("sentence", row.sentence)
            .center()
            .italic()
            .css("max-width", "700px")
            .print(),

        newText("spacer1", "<br>").print(),

        newText("rating_prompt", "How natural does this sentence sound?")
            .center()
            .print(),

        newText("spacer2", "<br>").print(),

        // ── 5-point Likert scale ─────────────────────────
        newScale("response","1","2","3","4","5")
            .labelsPosition("bottom")
            .center()
            .print()
            .wait()
            .log(),

        newText("spacer3", "<br>").print(),

        // ── Next button (gated on rating selection) ───────
        newButton("Next")
            .center()
            .print()
            .wait(
                getScale("response").test.selected()
            )
    )
    // ── Log trial-level metadata ──────────────────────────
    .log("age", getVar("VAR_age"))
    .log("dialect", getVar("VAR_dialect"))
    .log("trial_type", row.trial_type)
    .log("item",       row.item)
    .log("group",      row.group)
    .log("variant",    row.variant)
    .log("clause1",    row.clause1)
    .log("clause2",    row.clause2)
    .log("sentence",   row.sentence)
);

// ------------------------------------------------------------------
// SEND RESULTS
// ------------------------------------------------------------------
SendResults("send");

// ------------------------------------------------------------------
// DEBRIEF
// ------------------------------------------------------------------
newTrial("debrief",
    newText("ty", "Thank you! That was the end of the study. Your responses have been recorded. If you have any questions about the study, please contact the researcher.")
        .center()
        .print(),
    
    newText("spacer4", "<br>").print(),

    newButton("done","Click Here to End Your Session").center().print().wait()
);
