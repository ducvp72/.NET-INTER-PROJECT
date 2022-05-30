
using LmsBackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd
{
    public class LmsContext : DbContext
    {
        public LmsContext(DbContextOptions<LmsContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ENROLL>().HasKey(table => new
            {
                table.AccountID,
                table.CourseID
            });

            modelBuilder.Entity<RESPONSIBILITY>().HasKey(table => new
            {
                table.AccountID,
                table.CourseID
            });

        }

        public DbSet<ACCOUNT> ACCOUNTs { get; set; }
        public DbSet<ENROLL> ENROLLs { get; set; }
        public DbSet<COURSE> COURSEs { get; set; }

        public DbSet<LESSON> LESSONs { get; set; }
        public DbSet<NOTIFY> NOTIFIes { get; set; }
        public DbSet<TOPIC> TOPICs { get; set; }
        public DbSet<COMMENT> COMMENTs { get; set; }
        public DbSet<QUIZ> QUIZs { get; set; }
        public DbSet<QUIZBODY> QUIZBODIes { get; set; }
        public DbSet<ROLE> ROLEs { get; set; }
        public DbSet<FEEDBACKATTEMP> FEEDBACKATTEMPs { get; set; }
        public DbSet<FEEDBACK> FEEDBACKs { get; set; }
        public DbSet<POINT> POINTs { get; set; }
        public DbSet<QUIZATTEMP> QUIZATTEMPs { get; set; }
        public DbSet<RESPONSIBILITY> RESPONSIBILITIes { get; set; }
        public DbSet<CLASSMEMBER> CLASSMEMBERs { get; set; }
    }
}