{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.postgresql
    pkgs.yarn
    pkgs.nodePackages.typescript
    pkgs.nodePackages.prisma
    pkgs.openssl_1_1
  ];
} 