// Type shims for Nuxt UI components auto-registered by @nuxt/ui/vite plugin.
// These are resolved at runtime via unplugin-vue-components with the vue-router override.
import type { DefineComponent } from "vue";
import type { ButtonProps, ButtonSlots } from "@nuxt/ui/components/Button.vue";
import type { InputProps, InputSlots } from "@nuxt/ui/components/Input.vue";
import type { FormFieldProps, FormFieldSlots } from "@nuxt/ui/components/FormField.vue";
import type { LinkProps, LinkSlots } from "@nuxt/ui/dist/runtime/vue/overrides/vue-router/Link.vue";

declare module "vue" {
  interface GlobalComponents {
    UButton: DefineComponent<ButtonProps> & { new (): { $slots: ButtonSlots } };
    UInput: DefineComponent<InputProps> & { new (): { $slots: InputSlots } };
    UFormField: DefineComponent<FormFieldProps> & { new (): { $slots: FormFieldSlots } };
    ULink: DefineComponent<LinkProps> & { new (): { $slots: LinkSlots } };
  }
}

export {};
