using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace LmsBackEnd.Migrations
{
    public partial class v0 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ACCOUNTs",
                columns: table => new
                {
                    ID = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    UserPassword = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    IsMailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    GioiTinh = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserRole = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LearningRank = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ACCOUNTs", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "COURSEs",
                columns: table => new
                {
                    CourseID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CourseName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CourseDetail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CourseDuration = table.Column<int>(type: "int", nullable: false),
                    UrlLink = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    filetype = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_COURSEs", x => x.CourseID);
                });

            migrationBuilder.CreateTable(
                name: "FEEDBACKs",
                columns: table => new
                {
                    FeedbackID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FeedbackName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FeedbackDetail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ExpiredDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ques1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ques2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ques3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ques4 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ques5 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FEEDBACKs", x => x.FeedbackID);
                });

            migrationBuilder.CreateTable(
                name: "NOTIFIes",
                columns: table => new
                {
                    NotifyID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NotifyName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NotifyDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    IsOutDated = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NOTIFIes", x => x.NotifyID);
                });

            migrationBuilder.CreateTable(
                name: "POINTs",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Folder = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateSubmit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    point = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_POINTs", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "QUIZATTEMPs",
                columns: table => new
                {
                    AttempID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    QuizID = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    AccountID = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: true),
                    Score = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QUIZATTEMPs", x => x.AttempID);
                });

            migrationBuilder.CreateTable(
                name: "ROLEs",
                columns: table => new
                {
                    roleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    roleName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ROLEs", x => x.roleId);
                });

            migrationBuilder.CreateTable(
                name: "TOPICs",
                columns: table => new
                {
                    TopicID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TopicName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TopicDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsOutDated = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TOPICs", x => x.TopicID);
                });

            migrationBuilder.CreateTable(
                name: "CLASSMEMBERs",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    InstructorID = table.Column<string>(type: "nvarchar(8)", nullable: true),
                    MentorID = table.Column<string>(type: "nvarchar(8)", nullable: true),
                    ClassAdminID = table.Column<string>(type: "nvarchar(8)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CLASSMEMBERs", x => x.ID);
                    table.ForeignKey(
                        name: "FK_CLASSMEMBERs_ACCOUNTs_ClassAdminID",
                        column: x => x.ClassAdminID,
                        principalTable: "ACCOUNTs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CLASSMEMBERs_ACCOUNTs_InstructorID",
                        column: x => x.InstructorID,
                        principalTable: "ACCOUNTs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CLASSMEMBERs_ACCOUNTs_MentorID",
                        column: x => x.MentorID,
                        principalTable: "ACCOUNTs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CLASSMEMBERs_COURSEs_CourseID",
                        column: x => x.CourseID,
                        principalTable: "COURSEs",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ENROLLs",
                columns: table => new
                {
                    AccountID = table.Column<string>(type: "nvarchar(8)", nullable: false),
                    CourseID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Score1 = table.Column<int>(type: "int", nullable: false),
                    Score2 = table.Column<int>(type: "int", nullable: false),
                    AvgScore = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ENROLLs", x => new { x.AccountID, x.CourseID });
                    table.ForeignKey(
                        name: "FK_ENROLLs_ACCOUNTs_AccountID",
                        column: x => x.AccountID,
                        principalTable: "ACCOUNTs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ENROLLs_COURSEs_CourseID",
                        column: x => x.CourseID,
                        principalTable: "COURSEs",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LESSONs",
                columns: table => new
                {
                    LessonID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LessonName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonDuration = table.Column<int>(type: "int", nullable: false),
                    UrlLesson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CourseID = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LESSONs", x => x.LessonID);
                    table.ForeignKey(
                        name: "FK_LESSONs_COURSEs_CourseID",
                        column: x => x.CourseID,
                        principalTable: "COURSEs",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RESPONSIBILITIes",
                columns: table => new
                {
                    AccountID = table.Column<string>(type: "nvarchar(8)", nullable: false),
                    CourseID = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RESPONSIBILITIes", x => new { x.AccountID, x.CourseID });
                    table.ForeignKey(
                        name: "FK_RESPONSIBILITIes_ACCOUNTs_AccountID",
                        column: x => x.AccountID,
                        principalTable: "ACCOUNTs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RESPONSIBILITIes_COURSEs_CourseID",
                        column: x => x.CourseID,
                        principalTable: "COURSEs",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FEEDBACKATTEMPs",
                columns: table => new
                {
                    FeedbackAttempID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountID = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: true),
                    AttempWhen = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FeedbackID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Answer1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Answer2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Answer3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Answer4 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Answer5 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FEEDBACKATTEMPs", x => x.FeedbackAttempID);
                    table.ForeignKey(
                        name: "FK_FEEDBACKATTEMPs_ACCOUNTs_AccountID",
                        column: x => x.AccountID,
                        principalTable: "ACCOUNTs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FEEDBACKATTEMPs_FEEDBACKs_FeedbackID",
                        column: x => x.FeedbackID,
                        principalTable: "FEEDBACKs",
                        principalColumn: "FeedbackID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "COMMENTs",
                columns: table => new
                {
                    CommentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommentDetail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CommentTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AccountName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccountID = table.Column<string>(type: "nvarchar(8)", nullable: true),
                    TopicID = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_COMMENTs", x => x.CommentID);
                    table.ForeignKey(
                        name: "FK_COMMENTs_ACCOUNTs_AccountID",
                        column: x => x.AccountID,
                        principalTable: "ACCOUNTs",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_COMMENTs_TOPICs_TopicID",
                        column: x => x.TopicID,
                        principalTable: "TOPICs",
                        principalColumn: "TopicID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QUIZs",
                columns: table => new
                {
                    QuizID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QuizName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuizDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonID = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QUIZs", x => x.QuizID);
                    table.ForeignKey(
                        name: "FK_QUIZs_LESSONs_LessonID",
                        column: x => x.LessonID,
                        principalTable: "LESSONs",
                        principalColumn: "LessonID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QUIZBODIes",
                columns: table => new
                {
                    QuestionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionNo = table.Column<int>(type: "int", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RightAnswer = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WrongAnswer1 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WrongAnswer2 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WrongAnswer3 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    QuestionScore = table.Column<int>(type: "int", nullable: false),
                    QuizID = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QUIZBODIes", x => x.QuestionID);
                    table.ForeignKey(
                        name: "FK_QUIZBODIes_QUIZs_QuizID",
                        column: x => x.QuizID,
                        principalTable: "QUIZs",
                        principalColumn: "QuizID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CLASSMEMBERs_ClassAdminID",
                table: "CLASSMEMBERs",
                column: "ClassAdminID");

            migrationBuilder.CreateIndex(
                name: "IX_CLASSMEMBERs_CourseID",
                table: "CLASSMEMBERs",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_CLASSMEMBERs_InstructorID",
                table: "CLASSMEMBERs",
                column: "InstructorID");

            migrationBuilder.CreateIndex(
                name: "IX_CLASSMEMBERs_MentorID",
                table: "CLASSMEMBERs",
                column: "MentorID");

            migrationBuilder.CreateIndex(
                name: "IX_COMMENTs_AccountID",
                table: "COMMENTs",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_COMMENTs_TopicID",
                table: "COMMENTs",
                column: "TopicID");

            migrationBuilder.CreateIndex(
                name: "IX_ENROLLs_CourseID",
                table: "ENROLLs",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_FEEDBACKATTEMPs_AccountID",
                table: "FEEDBACKATTEMPs",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_FEEDBACKATTEMPs_FeedbackID",
                table: "FEEDBACKATTEMPs",
                column: "FeedbackID");

            migrationBuilder.CreateIndex(
                name: "IX_LESSONs_CourseID",
                table: "LESSONs",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_QUIZBODIes_QuizID",
                table: "QUIZBODIes",
                column: "QuizID");

            migrationBuilder.CreateIndex(
                name: "IX_QUIZs_LessonID",
                table: "QUIZs",
                column: "LessonID");

            migrationBuilder.CreateIndex(
                name: "IX_RESPONSIBILITIes_CourseID",
                table: "RESPONSIBILITIes",
                column: "CourseID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CLASSMEMBERs");

            migrationBuilder.DropTable(
                name: "COMMENTs");

            migrationBuilder.DropTable(
                name: "ENROLLs");

            migrationBuilder.DropTable(
                name: "FEEDBACKATTEMPs");

            migrationBuilder.DropTable(
                name: "NOTIFIes");

            migrationBuilder.DropTable(
                name: "POINTs");

            migrationBuilder.DropTable(
                name: "QUIZATTEMPs");

            migrationBuilder.DropTable(
                name: "QUIZBODIes");

            migrationBuilder.DropTable(
                name: "RESPONSIBILITIes");

            migrationBuilder.DropTable(
                name: "ROLEs");

            migrationBuilder.DropTable(
                name: "TOPICs");

            migrationBuilder.DropTable(
                name: "FEEDBACKs");

            migrationBuilder.DropTable(
                name: "QUIZs");

            migrationBuilder.DropTable(
                name: "ACCOUNTs");

            migrationBuilder.DropTable(
                name: "LESSONs");

            migrationBuilder.DropTable(
                name: "COURSEs");
        }
    }
}
