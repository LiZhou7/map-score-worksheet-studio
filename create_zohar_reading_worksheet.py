from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUT = "outputs/zohar_betker_individualized_reading_worksheet.pdf"


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8.5)
    canvas.setFillColor(colors.HexColor("#555555"))
    canvas.drawCentredString(letter[0] / 2, 0.38 * inch, f"Page {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        "Title2",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#143642"),
        alignment=TA_CENTER,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12.5,
        leading=15,
        textColor=colors.HexColor("#143642"),
        spaceBefore=8,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        "Body2",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.2,
        leading=13.2,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        "Passage",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.4,
        leading=14,
        firstLineIndent=14,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        "Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#333333"),
    )
)
styles.add(
    ParagraphStyle(
        "Question",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.8,
        leading=11.6,
        spaceAfter=2,
    )
)


def box(text, bg="#edf6f9"):
    t = Table([[Paragraph(text, styles["Small"])]], colWidths=[7.05 * inch])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(bg)),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#8aa6ac")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return t


def lines(n=2):
    return Paragraph("<br/>".join(["_" * 92 for _ in range(n)]), styles["Question"])


def add_q(story, num, question, skill, line_count=0):
    story.append(Paragraph(f"{num}. {question}", styles["Question"]))
    story.append(Paragraph(f"<i>Skill: {skill}</i>", styles["Small"]))
    if line_count:
        story.append(lines(line_count))
    story.append(Spacer(1, 1.5))


doc = BaseDocTemplate(
    OUT,
    pagesize=letter,
    leftMargin=0.65 * inch,
    rightMargin=0.65 * inch,
    topMargin=0.52 * inch,
    bottomMargin=0.62 * inch,
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
doc.addPageTemplates([PageTemplate(id="worksheet", frames=[frame], onPage=footer)])

story = []
story.append(Paragraph("Individualized Reading Worksheet", styles["Title2"]))
story.append(Paragraph("<b>Student:</b> Zohar Elazar Betker &nbsp;&nbsp;&nbsp;&nbsp; <b>Date:</b> ____________________", styles["Body2"]))
story.append(box("<b>Skill Focus</b><br/>Use details from a literary text to analyze point of view, character thoughts and actions, conflict and plot, setting and mood, and theme or lesson."))

story.append(Paragraph("Original Literary Passage", styles["Section"]))
story.append(Paragraph("<b>The Last Page of the Rainy-Day Book</b>", styles["Body2"]))
for p in [
    "Rain tapped against the classroom windows like fingers asking to come in. During indoor recess, most students crowded around board games or folded paper airplanes. Maya sat at the reading table with the class story notebook. Every Friday, one student added a page to it. Today was Maya's turn, and she had no ideas at all.",
    "The notebook already held dragons, lost keys, and a talking lunchbox. Maya wanted her page to be just as exciting. She pressed her pencil so hard that the point snapped. Across the room, Leo laughed as his paper airplane looped over a desk and landed in the recycling bin.",
    "\"Maybe your airplane can fly into the story,\" Maya said.",
    "Leo shrugged. \"Maybe. But you always write quiet stories.\" His words were not mean, but they still landed heavily. Maya looked down at the blank page. She wondered if quiet stories could matter.",
    "Ms. Alvarez dimmed the lights because the storm made the room gloomy. The classroom changed. The fish tank glowed blue. Rain streaked the windows. Even the coats on their hooks looked like sleepy giants. Maya noticed Leo standing by the window, holding a torn airplane wing.",
    "\"It was supposed to fly to the moon,\" he said softly.",
    "Maya smiled. \"What if it almost did?\"",
    "Together they wrote about a paper airplane that wanted to reach the moon but kept getting pushed down by rain. It learned to ride the wind between raindrops. Leo drew silver clouds in the margin, and Maya added a tiny classroom far below.",
    "When recess ended, Ms. Alvarez read the new page aloud. The room grew still. Leo leaned forward, surprised. Maya felt her cheeks warm, but this time she did not hide the page. The story was quiet, but it carried everyone somewhere.",
    "At the bottom, Maya wrote one last sentence: Sometimes the smallest wings lift the biggest dreams.",
]:
    story.append(Paragraph(p, styles["Passage"]))

story.append(Paragraph("Warm-Up", styles["Section"]))
add_q(story, "1", "Who is telling the story: Maya, Leo, or an outside narrator? How can you tell?", "Identifies the narrator in literary text", 1)
add_q(story, "2", "Circle two details in the passage that show the classroom setting during the storm.", "Identifies setting; Recognizes description of setting", 0)

story.append(PageBreak())
story.append(Paragraph("Questions", styles["Title2"]))
story.append(Paragraph("<b>Student:</b> Zohar Elazar Betker &nbsp;&nbsp;&nbsp;&nbsp; <b>Date:</b> ____________________", styles["Body2"]))

story.append(Paragraph("Multiple Choice", styles["Section"]))
add_q(story, "3", "Which choice best describes Maya at the beginning of the passage?<br/>A. Angry because Leo took the notebook<br/>B. Unsure because she cannot think of an idea<br/>C. Excited because her story is finished<br/>D. Careless because she breaks the pencil", "Describes character traits or attributes; Infers character feelings or thoughts")
add_q(story, "4", "How does the stormy setting affect the mood of the classroom?<br/>A. It makes the classroom feel quiet and a little gloomy.<br/>B. It makes everyone want to go outside.<br/>C. It makes the story confusing.<br/>D. It makes Leo stop drawing.", "Analyzes how setting affects mood")
add_q(story, "5", "What event helps move the plot toward the resolution?<br/>A. Maya sees the fish tank glow blue.<br/>B. Leo says his airplane was supposed to fly to the moon.<br/>C. Students play board games.<br/>D. Ms. Alvarez checks the weather.", "Identifies events that lead to resolution of problem/conflict")
add_q(story, "6", "Which sentence best states a theme of the passage?<br/>A. Rainy days are better than sunny days.<br/>B. Board games are the best indoor recess activity.<br/>C. Small, quiet ideas can become meaningful when people believe in them.<br/>D. Paper airplanes always fly farther when they are torn.", "Determines theme in literary text")

story.append(Paragraph("Short Answer and Text Evidence", styles["Section"]))
add_q(story, "7", "How does Maya's point of view about quiet stories change from the middle to the end of the passage? Use one detail from the text.", "Understands how a character's point of view affects the story; Determines details that support an inference in literary text", 1)
add_q(story, "8", "Explain how Leo's action or words help solve Maya's problem. Use text evidence.", "Analyzes how characters' traits, feelings, or actions contribute to plot; Identifies events that lead to resolution of problem/conflict", 1)
add_q(story, "9", "What does the final sentence, \"Sometimes the smallest wings lift the biggest dreams,\" suggest about the lesson Maya learns?", "Determines the lesson learned by a character; Determines moral, lesson, or message in literary text", 1)

story.append(Paragraph("Exit Question", styles["Section"]))
add_q(story, "10", "In one sentence, summarize the most important events in the story from problem to resolution.", "Summarizes a sequence of events in literary text", 1)

story.append(Paragraph("Teacher Answer Key", styles["Title2"]))
story.append(Paragraph("<b>Student:</b> Zohar Elazar Betker &nbsp;&nbsp;&nbsp;&nbsp; <b>Instructional Level:</b> Fourth-grade reading", styles["Body2"]))
story.append(box("<b>Reteaching Suggestion</b><br/>If Zohar misses several items, reread the passage in chunks. Create a two-column chart labeled \"What the text says\" and \"What I can infer.\" Model one example for Maya's feelings, then have the student add evidence for Leo, the setting, and the theme."))

answers = [
    ("1", "Outside narrator. Sample evidence: the narrator uses names and third-person words such as \"Maya sat\" and \"Leo laughed.\""),
    ("2", "Accept details such as rain tapping on windows, storm making the room gloomy, dimmed lights, blue fish tank glow, rain streaking the windows, or coats looking like sleepy giants."),
    ("3", "B. Evidence: Maya has \"no ideas at all\" and looks at the blank page."),
    ("4", "A. Evidence: Ms. Alvarez dims the lights, the storm makes the room gloomy, and the room grows still later."),
    ("5", "B. Leo's moon comment gives Maya the idea for the paper-airplane story."),
    ("6", "C. Evidence: Maya worries quiet stories may not matter, but the class becomes still and the story carries everyone somewhere."),
    ("7", "Sample response: Maya first worries that quiet stories may not matter after Leo's comment. By the end, she does not hide the page because she sees that a quiet story can move the class. Evidence: \"The story was quiet, but it carried everyone somewhere.\""),
    ("8", "Sample response: Leo helps by sharing his torn airplane and saying it was supposed to fly to the moon. This gives Maya a story idea, and they write together."),
    ("9", "Sample response: The sentence suggests that even a small idea, a quiet story, or a paper airplane can help someone dream big. Maya learns that her kind of story can matter."),
    ("10", "Sample response: Maya cannot think of a story during indoor recess, but Leo's torn paper airplane gives her an idea, and together they write a quiet story that the class enjoys."),
]
data = [[Paragraph("<b>Item</b>", styles["Small"]), Paragraph("<b>Correct Answer / Sample Response and Evidence</b>", styles["Small"])]]
for num, ans in answers:
    data.append([Paragraph(num, styles["Small"]), Paragraph(ans, styles["Small"])])
tbl = Table(data, colWidths=[0.45 * inch, 6.55 * inch], repeatRows=1)
tbl.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dcebef")),
    ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#9aaeb3")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
]))
story.append(tbl)

doc.build(story)
print(OUT)
