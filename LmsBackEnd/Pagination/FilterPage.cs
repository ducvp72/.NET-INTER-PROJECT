
namespace LmsBackEnd
{
    public class FilterPage
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public FilterPage()
    {
        this.PageNumber = 1;
        this.PageSize = 8;
    }
    public FilterPage(int pageNumber, int pageSize)
    {
        this.PageNumber = pageNumber < 1 ? 1 : pageNumber;
        this.PageSize = pageSize > 8 ? 8 : pageSize;
    }
}
}