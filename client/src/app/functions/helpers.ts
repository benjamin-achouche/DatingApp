import { HttpParams, HttpResponse } from "@angular/common/http";
import { signal, WritableSignal } from "@angular/core";
import { IList } from "../models/list.model";

export function setPagingResponse<T>(res: HttpResponse<T[]>, listSignal: WritableSignal<IList<T> | null>) {
  listSignal.set({
    items: res.body as T[],
    paging: JSON.parse(res.headers.get("Pagination")!)
  })
}

export function setPagingHeaders<T>(pageNumber: number, pageSize: number): HttpParams {
  let params = new HttpParams();

  if (pageNumber && pageSize) {
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
  }

  return params;
}