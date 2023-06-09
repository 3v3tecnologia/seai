export interface ServiceProtocol<Req, Res> {
  execute(params: Req): Promise<Res>;
}
