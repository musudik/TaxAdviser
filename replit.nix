{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.openssl_1_1
    pkgs.postgresql
  ];
}