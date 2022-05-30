
namespace LmsBackEnd
{

    public class PageResponse<T>
    {
    public PageResponse()
    {
    }
    public PageResponse(T data)
    {
        Succeeded = true;
        Message = string.Empty;
        Errors = null;
        Data = data;
    }
    public T Data { get; set; }
    public bool Succeeded { get; set; }
    public string[] Errors { get; set; }
    public string Message { get; set; }
    }

}
