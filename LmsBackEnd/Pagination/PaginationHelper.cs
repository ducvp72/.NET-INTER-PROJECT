
using System;
using System.Collections.Generic;

namespace LmsBackEnd
{
    public class PaginationHelper
    {
        public static Paged<List<T>> CreatePagedReponse<T>(List<T> pagedData, FilterPage validFilter, int totalRecords, IUriService uriService, string route)
        {
            var respose = new Paged<List<T>>(pagedData, validFilter.PageNumber, validFilter.PageSize);

            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);

            int roundedTotalPages = Convert.ToInt32(Math.Ceiling(totalPages));

            respose.NextPage =
                validFilter.PageNumber >= 1 && validFilter.PageNumber < roundedTotalPages
                ? uriService.GetPageUri(new FilterPage(validFilter.PageNumber + 1, validFilter.PageSize), route)
                : null;

            respose.PreviousPage =
                validFilter.PageNumber - 1 >= 1 && validFilter.PageNumber <= roundedTotalPages
                ? uriService.GetPageUri(new FilterPage(validFilter.PageNumber - 1, validFilter.PageSize), route)
                : null;

            respose.FirstPage = uriService.GetPageUri(new FilterPage(1, validFilter.PageSize), route);

            respose.LastPage = uriService.GetPageUri(new FilterPage(roundedTotalPages, validFilter.PageSize), route);
            
            respose.TotalPages = roundedTotalPages;
            
            respose.TotalRecords = totalRecords;
            return respose;
        }
    }
}