
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd.Controllers
{
    public class RegisterAccount : IRegister
    {
        private readonly LmsContext _context;
        public RegisterAccount(LmsContext context)
        {
            _context = context;
        }
        public async Task AddUser(ACCOUNT aCCOUNT)
        {
            if (aCCOUNT.ID == null)
            {
                throw new ArgumentNullException(nameof(aCCOUNT));
            }
            await _context.AddAsync(aCCOUNT);
        }

        public void DeleteUserID(ACCOUNT aCCOUNT)
        {
            var comments = _context.COMMENTs.Where(c => c.AccountID == aCCOUNT.ID).ToList();
            if (comments != null)
            {
                foreach (var comment in comments)
                {
                    _context.COMMENTs.Remove(comment);
                }
            }

            var enrolls = _context.ENROLLs.Where(e => e.AccountID == aCCOUNT.ID).ToList();
            if (enrolls != null)
            {
                foreach (var enroll in enrolls)
                {
                    _context.ENROLLs.Remove(enroll);
                }
            }

            var feedbacks = _context.FEEDBACKATTEMPs.Where(f => f.AccountID == aCCOUNT.ID).ToList();
            if (feedbacks != null)
            {
                foreach (var feedback in feedbacks)
                {
                    _context.FEEDBACKATTEMPs.Remove(feedback);
                }
            }

            var quizAttempts = _context.QUIZATTEMPs.Where(q => q.AccountID == aCCOUNT.ID).ToList();
            if (quizAttempts != null)
            {
                foreach (var quizAttempt in quizAttempts)
                {
                    _context.QUIZATTEMPs.Remove(quizAttempt);
                }
            }
            _context.ACCOUNTs.Remove(aCCOUNT);
        }

        public async Task<IEnumerable<ACCOUNT>> GetALL()
        {
            //var accounts = await _context.ACCOUNTs.Include(a => a.ENROLLS).ToListAsync();
            var accounts = await _context.ACCOUNTs.ToListAsync();
            return accounts;
        }

        public async Task<ACCOUNT> GetUserID(string id)
        {
            var account = await _context.ACCOUNTs.FindAsync(id);
            // await _context.Entry(account).Collection(c => c.ENROLLS).LoadAsync();
            return account;
        }

        public async Task<ACCOUNT> GetByName(string name)
        {
            var account = await _context.ACCOUNTs.FirstOrDefaultAsync(u => u.UserName == name);
            return account;
        }

        public async Task<ACCOUNT> GetByEmail(string email)
        {
            var account = await _context.ACCOUNTs.FirstOrDefaultAsync(u => u.Email == email);
            return account;
        }

        public async Task SaveChange()
        {
            await _context.SaveChangesAsync();
        }
    }
}