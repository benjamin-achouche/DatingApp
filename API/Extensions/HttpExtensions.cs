using System.Text.Json;
using API.Helpers;

namespace API.Extensions;

public static class HttpExtensions {

  public static void AddPaginationHeader<T>(this HttpResponse response, PagedList<T> data) {
    var paginationHeader = new PaginationHeader(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);
    var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    const string pagination = "Pagination"; 
    response.Headers.Append(pagination, JsonSerializer.Serialize(paginationHeader, jsonOptions));
    response.Headers.Append("Access-Control-Expose-Headers", pagination);
  }

}
