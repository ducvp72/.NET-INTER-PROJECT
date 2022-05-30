
using System;

namespace LmsBackEnd
{
    public interface IUriService
    {
        public Uri GetPageUri(FilterPage filter, string route);
    }
}