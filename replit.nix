
{ pkgs }: {
    deps = [
        pkgs.openssl_1_1
        pkgs.nodejs-18_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
        pkgs.postgresql
    ];
}
