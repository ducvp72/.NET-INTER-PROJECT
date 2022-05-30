
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd
{
    public class Notify : INotify
    {
        private readonly LmsContext _context;

        public Notify(LmsContext context)
        {
            _context = context;
        }

        public Task AddNotify(NOTIFY notify)
        {
            throw new System.NotImplementedException();
        }

        public async Task DeleteNotify(NOTIFY notify)
        {
             _context.Remove(notify);
        }

        public async Task<IEnumerable<NOTIFY>> GetALLAdmin()
        {
            var notify = await _context.NOTIFIes.ToListAsync();
            return notify;
        }

        public async Task<IEnumerable<NOTIFY>> GetALL()
        {
            var notify = await _context.NOTIFIes.Where(n => n.IsConfirmed).ToListAsync();
            return notify;
        }

        public Task<NOTIFY> GetNotifyByName(string name)
        {
            throw new System.NotImplementedException();
        }

        public Task<NOTIFY> GetNotifyID(string id)
        {
            throw new System.NotImplementedException();
        }

        public async Task SaveChange()
        {
            await _context.SaveChangesAsync();
        }

        public Task<IEnumerable<NOTIFY>> SearchNotifyByID(string id)
        {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<NOTIFY>> SearchNotifyByName(string name)
        {
            throw new System.NotImplementedException();
        }
    }
}