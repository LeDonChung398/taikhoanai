import { MetadataRoute } from "next";
import { products } from "@/lib/mock-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taikhoanai.local";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6
    },
    {
      url: `${siteUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5
    }
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8
  }));

  return [...staticPages, ...productPages];
}
