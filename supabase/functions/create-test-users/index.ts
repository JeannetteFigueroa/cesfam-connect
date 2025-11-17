import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

Deno.serve(async (req) => {
  try {
    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'equipo7@micesfam.cl',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        nombre: 'Equipo',
        apellido: '7',
        tipo_documento: 'rut',
        documento: '11111111-1',
        celular: '+56912345678',
        fecha_nacimiento: '1990-01-01',
        role: 'admin'
      }
    })

    if (adminError) throw adminError

    // Create doctor user
    const { data: doctorUser, error: doctorError } = await supabaseAdmin.auth.admin.createUser({
      email: 'medico.prueba@micesfam.cl',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        nombre: 'Doctor',
        apellido: 'Prueba',
        tipo_documento: 'rut',
        documento: '22222222-2',
        celular: '+56987654321',
        fecha_nacimiento: '1985-05-15',
        role: 'medico'
      }
    })

    if (doctorError) throw doctorError

    // Get first CESFAM
    const { data: cesfam } = await supabaseAdmin
      .from('cesfams')
      .select('id')
      .limit(1)
      .single()

    // Create doctor profile
    if (doctorUser.user && cesfam) {
      const { error: medicoError } = await supabaseAdmin
        .from('medicos')
        .insert({
          user_id: doctorUser.user.id,
          especialidad: 'Medicina General',
          rut_profesional: '22222222-2',
          cesfam_id: cesfam.id
        })

      if (medicoError) throw medicoError
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuarios de prueba creados exitosamente',
        users: {
          admin: {
            email: 'equipo7@micesfam.cl',
            password: '123456'
          },
          doctor: {
            email: 'medico.prueba@micesfam.cl',
            password: '123456'
          }
        }
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
